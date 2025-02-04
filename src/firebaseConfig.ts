import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
      apiKey: "AIzaSyBsKIvoNccSz3CvjqubywrCp70G4K672b0",
  authDomain: "easynote-3013e.firebaseapp.com",
  projectId: "easynote-3013e",
  storageBucket: "easynote-3013e.firebasestorage.app",
  messagingSenderId: "439901326097",
  appId: "1:439901326097:web:5610a6eaabf32953d91ab0",
  measurementId: "G-9GLPV0D558"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

