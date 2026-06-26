
import { supabase } from "./supabase.js";

supabase.auth.getUser().then(({ data }) => {
  console.log("USER =", data.user);
});


// Vérifier si l'utilisateur est connecté
supabase.auth.getUser().then(({ data }) => {
  console.log("USER =", data.user);
});

// Charger les messages au démarrage
loadMessages();

// Fonction pour envoyer un message
async function sendMessage() {
  const { data } = await supabase.auth.getUser();

  console.log("USER =", data.user);

  if (!data.user) {
    alert("Tu n'es pas connecté !");
    return;
  }

  const content = document.getElementById("messageInput").value;

  if (!content.trim()) return;

  const { error } = await supabase
    .from("messages")
    .insert({
      user_id: data.user.id,
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
    status.textContent = error.message;
    return;
  }

  messagesDiv.innerHTML = "";

  data.forEach(m => {
    const div = document.createElement("div");
    div.classList.add("message");

    // Si c’est TON message → bulle à droite
    if (m.user_id === userData.user.id) {
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

  // Auto-scroll vers le bas
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

