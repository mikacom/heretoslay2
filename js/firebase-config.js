import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
   apiKey: "AIzaSyBrCllyTdOguczFuc_6FjK3R4-JyJoK0us",
  authDomain: "study-timer-website.firebaseapp.com",
  databaseURL: "https://study-timer-website-default-rtdb.firebaseio.com",
  projectId: "study-timer-website",
  storageBucket: "study-timer-website.firebasestorage.app",
  messagingSenderId: "805464993611",
  appId: "1:805464993611:web:8063e096756319217902ce"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);