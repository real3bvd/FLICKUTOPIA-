import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAtFE1IABSxaanuJqzIm7pXDnDNujSxCOM",
    authDomain: "flickutopia.firebaseapp.com",
    projectId: "flickutopia",
    storageBucket: "flickutopia.firebasestorage.app",
    messagingSenderId: "243100652706",
    appId: "1:243100652706:web:a45aa6853f49839c5fb3fb",
    measurementId: "G-ES1XZ453F2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
