// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAV-49ZNXm26_uOezqUUf6jNew1xTOuTJs",
    authDomain: "nexprep-c1462.firebaseapp.com",
    projectId: "nexprep-c1462",
    storageBucket: "nexprep-c1462.firebasestorage.app",
    messagingSenderId: "1093054324958",
    appId: "1:1093054324958:web:33801acce857a652b5624f",
    measurementId: "G-9QQGQDC10Q"
};

// Initialize Firebase
const app =!getApps.length ? initializeApp(firebaseConfig): getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);