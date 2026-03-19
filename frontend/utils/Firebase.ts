import {getAuth} from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "iclaim-1ca91.firebaseapp.com",
  projectId: "iclaim-1ca91",
  storageBucket: "iclaim-1ca91.firebasestorage.app",
  messagingSenderId: "539121617022",
  appId: "1:539121617022:web:17420b2e449d3ec193702f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = GoogleAuthProvider()

export {auth, provider}