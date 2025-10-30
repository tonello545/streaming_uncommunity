import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNfrBAMjSRcpWDo2z0RZlQGJ9A8qsASIg",
  authDomain: "francesco-streaming-service.firebaseapp.com",
  projectId: "francesco-streaming-service",
  storageBucket: "francesco-streaming-service.firebasestorage.app",
  messagingSenderId: "422504588307",
  appId: "1:422504588307:web:3be9b7bd87e246fb1e4be6",
  measurementId: "G-XPSV8VWXT1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Authentication
export const auth = getAuth(app);

export default app;
