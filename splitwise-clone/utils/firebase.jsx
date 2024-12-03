import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from 'firebase/database';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEOsvq8UYSXev2fu6h-LllKVpqK87BXf0",
  authDomain: "testpractical1home.firebaseapp.com",
  databaseURL: "https://testpractical1home-default-rtdb.firebaseio.com",
  projectId: "testpractical1home",
  storageBucket: "testpractical1home.appspot.com",
  messagingSenderId: "71435710627",
  appId: "1:71435710627:web:ce244f48a36513ac7f8f16"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Realtime Database
export const database = getDatabase(app);
