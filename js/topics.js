import { auth, db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const topicId = localStorage.getItem("topicId");

const topicTitle = document.getElementById("topicTitle");
const subDiv = document.getElementById("subtopics");
const subForm = document.getElementById("subForm");
const subInput = document.getElementById("subInput");

const addSubBtn = document.getElementById("addSubBtn");
const saveSubBtn = document.getElementById("saveSubBtn");

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const topicRef = doc(db, "users", user.uid, "topics", topicId);
  const topicSnap = await getDoc(topicRef);

  if (topicSnap.exists()) {
    topicTitle.innerText = topicSnap.data().name;
  }

  loadSubtopics(user.uid);
});


/* LOAD SUBTOPICS */
async function loadSubtopics(uid) {
  subDiv.innerHTML = "";

  const snapshot = await getDocs(
    collection(db, "users", uid, "topics", topicId, "subtopics")
  );

snapshot.forEach(docSnap => {
  const data = docSnap.data();

  const card = document.createElement("div");
  card.className = "topic-card";

  const nameSpan = document.createElement("span");
  nameSpan.innerText = data.name;

  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "🗑 Delete";
  deleteBtn.style.marginLeft = "10px";
  deleteBtn.style.background = "#ff6b6b";
  deleteBtn.style.color = "white";

  // Entire card is now clickable
  card.onclick = () => {
    localStorage.setItem("subId", docSnap.id);
    window.location.href = "timer.html";
  };

  // Delete still works without triggering card click
  deleteBtn.onclick = async (e) => {
    e.stopPropagation();

    const confirmDelete = confirm("Delete this subtopic?");
    if (!confirmDelete) return;

    await deleteDoc(
      doc(db, "users", uid, "topics", topicId, "subtopics", docSnap.id)
    );

    loadSubtopics(uid);
  };

  card.appendChild(nameSpan);
  card.appendChild(deleteBtn);
  subDiv.appendChild(card);
});

}


/* SHOW INPUT FIELD */
addSubBtn.addEventListener("click", () => {
  subForm.classList.toggle("hidden");
  subInput.focus();
});


/* ENTER KEY WORKS */
subInput.addEventListener("keypress", function(e){
  if(e.key === "Enter") createSubtopic();
});

saveSubBtn.addEventListener("click", createSubtopic);


/* CREATE SUBTOPIC */
async function createSubtopic() {

  const name = subInput.value.trim();
  if (!name) return;

  const uid = auth.currentUser.uid;

  await addDoc(
    collection(db, "users", uid, "topics", topicId, "subtopics"),
    {
      name: name,
      ratings: [],
      lastTime: 0,
      createdAt: new Date()
    }
  );

  subInput.value = "";
  subForm.classList.add("hidden");

  loadSubtopics(uid);
  
}
