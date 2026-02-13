import { auth } from "./firebase-config.js";
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const emailInput = document.getElementById("email");
const passInput = document.getElementById("password");

document.getElementById("loginBtn").addEventListener("click", login);
document.getElementById("signupBtn").addEventListener("click", signup);

async function login() {
  try {
    await signInWithEmailAndPassword(auth, emailInput.value, passInput.value);
    window.location.href = "dashboard.html";
  } catch (error) {
    alert(error.message);
  }
}

async function signup() {
  try {
    await createUserWithEmailAndPassword(auth, emailInput.value, passInput.value);
    window.location.href = "dashboard.html";
  } catch (error) {
    alert(error.message);
  }
}