// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore"; 
import { getMessaging, getToken, onMessage } from "firebase/messaging";


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

// const messaging = getMessaging(app);

// export const requestAndSaveToken = async (userId) => {
//   try {
//     const token = await getToken(messaging, {
//       vapidKey: "BK2BD0hqDQCl3uAwlD6SQVNL3Vz0BiEP3ebJL8chcj9EQnXObZCkQeWqjfpn_t8IdnRqTTwwt-uz6us3VjiZoXU"
//     })

//     if (token) {
//       console.log("FCM: ", token);

//       await setDoc(
//         doc(db, "users", userId),
//         { deviceToken: token },
//         { merge: true }
//       );
//       console.log("Device token saved");
//     } else {
//       console.warn("No FCM token recived. Permissions may be denied.");
//     }
//   } catch (error) {
//     console.error("Error retrieving or saving token:", error);
//   }
// };