import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCuCTRBLCaFEquNuMCdgA_r1CBIwyrcX38",
  authDomain: "restaurante-27533.firebaseapp.com",
  projectId: "restaurante-27533",
  storageBucket: "restaurante-27533.appspot.com",
  messagingSenderId: "1047224939851",
  appId: "1:1047224939851:web:25d79cf00dd450b9cfa4ce"
};


const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app);

const storage = getStorage(app);


export {app,auth,db,storage}