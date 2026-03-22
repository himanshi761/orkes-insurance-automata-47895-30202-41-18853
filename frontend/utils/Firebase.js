import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "iclaim-1ca91.firebaseapp.com",
  projectId: "iclaim-1ca91",
  storageBucket: "iclaim-1ca91.firebasestorage.app",
  messagingSenderId: "539121617022",
  appId: "1:539121617022:web:17420b2e449d3ec193702f"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Google Auth Provider
const provider = new GoogleAuthProvider();

export { auth, provider };