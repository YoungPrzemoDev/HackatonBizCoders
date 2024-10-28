// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDWXU09pO7eiFYYaATCyeYUYCJysPCRc2M",
  authDomain: "hackaton-8fca0.firebaseapp.com",
  projectId: "hackaton-8fca0",
  storageBucket: "hackaton-8fca0.appspot.com",
  messagingSenderId: "603658122812",
  appId: "1:603658122812:web:3f3255ab4e6c2010af7539",
  measurementId: "G-YVKY6MCWLK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);