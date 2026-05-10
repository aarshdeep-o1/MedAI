// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3IcS0IQOTWkmaNR4_25XlBPMXR5ZK408",
  authDomain: "mediai-182cf.firebaseapp.com",
  projectId: "mediai-182cf",
  storageBucket: "mediai-182cf.firebasestorage.app",
  messagingSenderId: "1029186902304",
  appId: "1:1029186902304:web:b25e7c75c77d0ef6691f45",
  measurementId: "G-ZZJGQT9EMH"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

console.log('✅ Firebase connected successfully!');

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db };