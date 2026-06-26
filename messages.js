import { supabase } from "./supabase.js";

let currentUser = null;

// Récupérer l'utilisateur AVANT de charger les messages
supabase.auth.getUser().then(({ data }) => {
  currentUser = data.user;
  console.log("USER =", currentUser);

  if (!currentUser) {
    alert("Tu dois être connecté pour utiliser la messagerie.");
    return;
  }

  loadMessages();
});

// Fonction pour envoyer un message
async function sendMessage() {
  if (!currentUser) return;

  const content = document.getElementById("messageInput").value.trim();
  if (!content) return;

  const { error } = await supabase
    .from("messages")
    .insert({
      user_id: currentUser.id,
      content: content
    });

  if (error) {
    console.error("Erreur INSERT :", error);
    alert("Erreur lors de l'envoi du message");
    return;
  }

  document.getElementById("messageInput").value = "";
  loadMessages();
}

// Fonction pour charger les messages
async function loadMessages() {
  const { data, error } = await supabase
    .from("messages")
    .select("content, created_at, user_id")
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  const messagesDiv = document.getElementById("messages");
  messagesDiv.innerHTML = "";

  data.forEach(m => {
    const div = document.createElement("div");
    div.classList.add("message");

    // Bulle à droite si c’est ton message
    if (currentUser && m.user_id === currentUser.id) {
      div.classList.add("me");
    } else {
      div.classList.add("other");
    }

    div.innerHTML = `
      <div class="content">${m.content}</div>
      <div class="timestamp">${new Date(m.created_at).toLocaleTimeString()}</div>
    `;

    messagesDiv.appendChild(div);
  });

  // Auto-scroll
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Bouton envoyer
document.getElementById("sendBtn").onclick = sendMessage;


// Déconnexion
const logoutLink = document.getElementById("logout-link");

if (logoutLink) {
    logoutLink.addEventListener("click", async () => {
        await supabase.auth.signOut();
        window.location.href = "login.html";
    });
}

const logoutLink = document.getElementById("logout-link");

if (logoutLink) {
    logoutLink.addEventListener("click", async () => {
        await supabase.auth.signOut();
        window.location.href = "login.html";
    });
}
