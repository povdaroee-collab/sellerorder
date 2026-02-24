import { initializeApp } from "firebase/app";
// ⭐️ ថែមពាក្យ onSnapshot នៅទីនេះ
import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, increment, doc, orderBy, getDoc, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ⭐️ ថែមពាក្យ onSnapshot នៅទីនេះ
export { db, collection, query, where, getDocs, addDoc, updateDoc, increment, doc, orderBy, getDoc, onSnapshot };