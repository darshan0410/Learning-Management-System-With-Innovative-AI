import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY ,
  authDomain: "codestudio-8ae6c.firebaseapp.com",
  projectId: "codestudio-8ae6c",
  storageBucket: "codestudio-8ae6c.firebasestorage.app",
  messagingSenderId: "941586714242",
  appId: "1:941586714242:web:4dbccebf16427ee9beae9b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
export {auth,provider}