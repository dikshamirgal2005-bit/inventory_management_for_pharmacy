import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace these with your actual Firebase project config 
const firebaseConfig = {
    apiKey: "AIzaSyD3WgWL_jLL7fEXj7kdecnp-SE_yfxgXkE",
    authDomain: "inventory-management-2f7aa.firebaseapp.com",
    projectId: "inventory-management-2f7aa",
    storageBucket: "inventory-management-2f7aa.firebasestorage.app",
    messagingSenderId: "324480271564",
    appId: "1:324480271564:web:024f7c8dc3005bb0ecee69",
    measurementId: "G-L0WK13LTHV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
