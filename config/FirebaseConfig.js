// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDq-L8zLKcnB6nWh4jxXxAtkpm06CkB00M",
  authDomain: "binder-b97c8.firebaseapp.com",
  projectId: "binder-b97c8",
  storageBucket: "binder-b97c8.firebasestorage.app",
  messagingSenderId: "410320664517",
  appId: "1:410320664517:web:dfb3204fdf513e55097dac"
};
 
// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);