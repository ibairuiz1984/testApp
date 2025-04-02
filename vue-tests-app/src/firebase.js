import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Base de datos

const firebaseConfig = {
    apiKey: "AIzaSyAHz4It52lZuq5ouVv12fDZlbO0xaJ2ryY",
    authDomain: "testdb-a4950.firebaseapp.com",
    projectId: "testdb-a4950",
    storageBucket: "testdb-a4950.firebasestorage.app",
    messagingSenderId: "674328318545",
    appId: "1:674328318545:web:52a5586c6f87b5e5e49e70",
    measurementId: "G-MFH7KCX587",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
