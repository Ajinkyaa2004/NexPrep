
import { initializeApp, getApps, getApp } from "firebase/app";
import {getAuth,} from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import { get } from "http";

const firebaseConfig = {
  apiKey: "AIzaSyBOBQgvMPLSThUnOo_UcnoWxaB_S4LbLmA",
  authDomain: "ai-based-interview-57855.firebaseapp.com",
  projectId: "ai-based-interview-57855",
  storageBucket: "ai-based-interview-57855.firebasestorage.app",
  messagingSenderId: "398452797653",
  appId: "1:398452797653:web:18548e14ab7311fec0725c",
  measurementId: "G-FLLYW3ZYKN"
};



const app = !getApps().length ? initializeApp(firebaseConfig):getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);