import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database'; // Import Realtime Database

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEOsvq8UYSXev2fu6h-LllKVpqK87BXf0",
  authDomain: "testpractical1home.firebaseapp.com",
  databaseURL: "https://testpractical1home-default-rtdb.firebaseio.com",
  projectId: "testpractical1home",
  storageBucket: "testpractical1home.appspot.com",
  messagingSenderId: "71435710627",
  appId: "1:71435710627:web:ce244f48a36513ac7f8f16"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app); // Initialize Realtime Database
