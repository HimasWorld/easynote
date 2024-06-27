import React from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBo0WRo1TxrDA8_xQdEmBl4q7i3Lg1hVfo",
    authDomain: "notes-test-a887b.firebaseapp.com",
    projectId: "notes-test-a887b",
    storageBucket: "notes-test-a887b.appspot.com",
    messagingSenderId: "88549523340",
    appId: "1:88549523340:web:584ed195ebbf5f93a720a9",
    measurementId: "G-3SWWDGGNSB"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

