import { auth, db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  getDocs,
  doc,         // Added this
  deleteDoc    // Added this
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const topicsDiv = document.getElementById("topics");
const topicForm = document.getElementById("topicForm");
const topicInput = document.getElementById("topicInput");

auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    loadTopics(user.uid);
  }
});

async function loadTopics(uid) {
  topicsDiv.innerHTML = "";

  try {
    const snapshot = await getDocs(collection(db, "users", uid, "topics"));

    snapshot.forEach(docSnap => {
      const data = docSnap.data();

      // Create the main card
      const div = document.createElement("div");
      div.className = "topic-card";
      
      // Use a span for the text so it doesn't overlap with the button
      const textSpan = document.createElement("span");
      textSpan.innerText = `${data.name} 📕💃 ${data.averageRating || 0}`;
      div.appendChild(textSpan);

      div.onclick = () => {
        localStorage.setItem("topicId", docSnap.id);
        window.location.href = "topic.html";
      };

      // Create the delete button
      const deleteBtn = document.createElement("span"); // Changed to span for cleaner look
      deleteBtn.innerText = " 🗑";
      deleteBtn.style.marginLeft = "15px";
      deleteBtn.style.color = "#ff6b6b";
      deleteBtn.style.cursor = "pointer";

      // Correct delete logic
      deleteBtn.onclick = async (e) => {
        e.stopPropagation(); // Prevents opening topic.html
        
        const confirmDelete = confirm("Delete this topic and all its contents?");
        if (!confirmDelete) return;

        try {
          // Fixed the path to match your createTopic path
          await deleteDoc(doc(db, "users", uid, "topics", docSnap.id));
          loadTopics(uid); // Refresh list
        } catch (error) {
          console.error("Error deleting document: ", error);
          alert("Could not delete. Check your Firebase rules.");
        }
      };

      div.appendChild(deleteBtn);
      topicsDiv.appendChild(div);
    });
  } catch (error) {
    console.error("Error loading topics: ", error);
  }
}

// TOGGLE FORM
window.toggleTopicForm = function() {
  topicForm.style.display = topicForm.style.display === "none" ? "block" : "none";
  if (topicForm.style.display === "block") topicInput.focus();
};

// CREATE TOPIC
window.createTopic = async function() {
  const name = topicInput.value.trim();
  if (!name) return;

  const uid = auth.currentUser.uid;

  try {
    await addDoc(collection(db, "users", uid, "topics"), {
      name: name,
      averageRating: 0,
      createdAt: new Date()
    });

    topicInput.value = "";
    topicForm.style.display = "none";
    loadTopics(uid);
  } catch (error) {
    console.error("Error adding topic: ", error);
  }
};

// ENTER KEY SUPPORT
topicInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") window.createTopic();
});