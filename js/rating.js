import { auth, db } from "./firebase-config.js";
import { 
  updateDoc,
  doc,
  arrayUnion
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const topicId = localStorage.getItem("topicId");
const subId = localStorage.getItem("subId");

/* STAR LABELS */
const labels = {
  1: "Too Bad",
  2: "Bad",
  3: "Okay",
  4: "Nice",
  5: "Excellent"
};

/* CREATE BUTTONS */
for (let i = 1; i <= 5; i++) {
  const btn = document.createElement("button");
  btn.innerText = `⭐ ${i} - ${labels[i]}`;
  btn.onclick = () => saveRating(i);
  btn.style.display = "block";
  btn.style.margin = "10px";
  btn.style.padding = "10px 20px";
  btn.style.fontSize = "18px";
  document.body.appendChild(btn);
}

/* SAVE RATING */
async function saveRating(value){
  const uid = auth.currentUser.uid;

  const subRef = doc(
    db, "users", uid, "topics", topicId, "subtopics", subId
  );

  await updateDoc(subRef, {
    ratings: arrayUnion(value)
  });

  window.location.href = "dashboard.html";
}
