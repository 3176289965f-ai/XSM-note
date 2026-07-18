import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

// Firebase App configuration
const firebaseConfig = {
  apiKey: "AIzaSyDaZ81kMtJDnH4vW8gZ-7ucXkpsWCuwCXQ",
  authDomain: "favorable-veld-t7c1c.firebaseapp.com",
  projectId: "favorable-veld-t7c1c",
  storageBucket: "favorable-veld-t7c1c.firebasestorage.app",
  messagingSenderId: "1003387563302",
  appId: "1:1003387563302:web:1e73f1f578d7776458e5e7",
  measurementId: ""
};

const customDatabaseId = "ai-studio-ee3bcf02-de94-4b63-85fa-b009c2606601";

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Firestore with custom database ID
const db = initializeFirestore(app, {}, customDatabaseId);

export { app, auth, db, googleProvider, signInWithPopup, signInWithRedirect, signOut };
