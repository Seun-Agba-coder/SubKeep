import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";


const firebaseConfig = {
  apiKey: "AIzaSyDB_J5DYot-2ZPsjNyF9u5Ph3W-m6vPuyY",
  authDomain: "subkeep-28aaa.firebaseapp.com",
  projectId: "subkeep-28aaa",
  storageBucket: "subkeep-28aaa.firebasestorage.app",
  messagingSenderId: "1026944721971",
  appId: "1:1026944721971:web:33a484a070f9b9d890af46"
};


export const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const firestore = getFirestore(app);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

