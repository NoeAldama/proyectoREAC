import { StyleSheet, Text, View } from 'react-native'
import React,{useState} from 'react'
import UsuarioAvatar from '../../../../../../assets/infoProfile.png'
import { Avatar } from '@rneui/base';
import * as ImagePicker from "expo-image-picker"
import * as Medialibrary from "expo-media-library"
import { auth, storage } from '../../../../../config/util/firebaseConnection';
import {updateProfile} from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Loading from '../../../../../kernel/components/Loading';


export default function InfoProfile(props) {
    const {infoUser:{photoURL,displayName,email,uid}} = props;
    const [isVisible,setVisible]= useState(false);
    const [showLoading,setShowLoading] = useState(false);
    const uploadImage = async (uri) => {
        setShowLoading(true);
        const response = await fetch(uri);
        const {_bodyBlob} = response;
        const storageRef = ref(storage, `avatar/${uid}`);
        return uploadBytes(storageRef,_bodyBlob)
    }

    const uploadPhotoUrl = () => {
        getDownloadURL(ref(storage, `avatar/${uid}`)).then((url) => {
            updateProfile(auth.currentUser,{
                photoURL: url
            }).catch((error) =>{
                console.log(error);
                alert("Ocurrio un errror")
            })
            .finally(()=>{
                setShowLoading(false);
            })
        });
    }
    const changeAvatar = async()=>{
        const resultPermission = await Medialibrary.requestPermissionsAsync();
        if(resultPermission.status !== "denied"){
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4,3],
                quality:1,
                //base64:true,
            });
            if(!result.canceled){
                setVisible(true);
                try{
                    await uploadImage(result.assets[0].uri);
                    await uploadPhotoUrl();
                    alert('Foto de perfil actualizada')
                }catch(error){
                    alert('Error al subir la imagen')
                }finally{
                    setVisible(false);
                }
            }
        }else{
            alert("Es necesario aceptar los permisos de la galeria")
        }
    }
    return (
        <View style={styles.row}>
            <Avatar
                size={64}
                rounded
                source={photoURL ? {uri:photoURL} : UsuarioAvatar}
                containerStyle={{ backgroundColor: 'grey' }}
            >
                <Avatar.Accessory size={24}
                onPress={changeAvatar} />
            </Avatar>
            <View style={{ flexDirection: 'column', marginLeft: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{displayName || 'Anonimo'}</Text>
                <Text style={{ fontSize: 12 }}>{email || "no hay correo electronico"}</Text>
            </View>
            <Loading visible={isVisible} title="Cambiando foto de perfil"/>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        padding: 16
      },
})