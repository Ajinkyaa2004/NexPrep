
import { initializeApp, getApps, getApp } from "firebase/app";
import {getAuth,} from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

// Use environment variables with fallback for development
// WARNING: Update .env.local with your own Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBOBQgvMPLSThUnOo_UcnoWxaB_S4LbLmA",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "ai-based-interview-57855.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ai-based-interview-57855",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "ai-based-interview-57855.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "398452797653",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:398452797653:web:18548e14ab7311fec0725c",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-FLLYW3ZYKN"
};



const app = !getApps().length ? initializeApp(firebaseConfig):getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);