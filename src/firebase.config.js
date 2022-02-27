
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCSsrmvZDfqx_1wHUxO29wMuHn557GfmoY",
  authDomain: "house-marketplace-app-d741a.firebaseapp.com",
  projectId: "house-marketplace-app-d741a",
  storageBucket: "house-marketplace-app-d741a.appspot.com",
  messagingSenderId: "418155931281",
  appId: "1:418155931281:web:48ff3df6b5f40846df0130"
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db = getFirestore()