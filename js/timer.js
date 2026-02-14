import { auth, db } from "./firebase-config.js";
import { 
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const topicId = localStorage.getItem("topicId");
const subId = localStorage.getItem("subId");

const title = document.getElementById("sessionTitle");
const minutesInput = document.getElementById("minutesInput");
const startBtn = document.getElementById("startBtn");
const timerDisplay = document.getElementById("timerDisplay");
const warningText = document.getElementById("warningText");
const alarm = document.getElementById("alarmSound"); // Reference to HTML audio

let totalSeconds = 0;
let interval = null;

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  const topicRef = doc(db, "users", user.uid, "topics", topicId);
  const topicSnap = await getDoc(topicRef);
  const subRef = doc(db, "users", user.uid, "topics", topicId, "subtopics", subId);
  const subSnap = await getDoc(subRef);

  if (topicSnap.exists() && subSnap.exists()) {
    title.innerText = topicSnap.data().name + " > " + subSnap.data().name;
  }
});

minutesInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") startTimer();
});

startBtn.addEventListener("click", startTimer);

function startTimer() {
  const mins = parseInt(minutesInput.value);

  if (!mins || mins <= 0) {
    alert("Enter valid time");
    return;
  }

  // --- IMPORTANT: UNLOCK AUDIO ---
  // We play and immediately pause it so the browser allows 
  // the sound to play later when the timer hits zero.
  alarm.play().then(() => {
    alarm.pause();
    alarm.currentTime = 0;
  }).catch(e => console.log("Audio waiting for user interaction"));

  totalSeconds = mins * 60;
  let timeLeft = totalSeconds;

  minutesInput.disabled = true;
  startBtn.disabled = true;

  interval = setInterval(() => {
    let m = Math.floor(timeLeft / 60);
    let s = timeLeft % 60;

    timerDisplay.innerText =
      (m < 10 ? "0" + m : m) + ":" +
      (s < 10 ? "0" + s : s);

    if (timeLeft === Math.floor(totalSeconds * 0.2)) {
      warningText.innerText = "⚠ Stay Focused – Almost Done!";
      setTimeout(() => { warningText.innerText = ""; }, 15000);
    }

    if (timeLeft <= 0) {
      clearInterval(interval);
      sessionFinished();
    }

    timeLeft--;
  }, 1000);
}

function sessionFinished() {
  // 1. Play the audio
  alarm.play();

  // 2. Vibrate (if mobile)
  if (navigator.vibrate) {
    navigator.vibrate(1000);
  }

  // 3. Wait 5 seconds before moving to rating.html 
  // (This gives the user time to hear the audio)
  setTimeout(() => {
    window.location.href = "rating.html";
  }, 5000);
}