
import { supabase } from "./supabase.js";

// ===============================
//  RÉCUPÉRER L’UTILISATEUR CONNECTÉ
// ===============================
let currentUser = null;

async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Erreur getUser:", error);
    return;
  }
  currentUser = data.user;
}

await getCurrentUser();

// ===============================
//  CHARGER LES MESSAGES
// ===============================
async function loadMessages() {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Erreur loadMessages:", error);
    return;
  }

  const container = document.getElementById("messages");
  container.innerHTML = "";

  data.forEach((msg) => {
    const div = document.createElement("div");
    div.classList.add("message");

    // Alignement selon l’auteur
    if (currentUser && msg.user_id === currentUser.id) {
      div.classList.add("me");
    } else {
      div.classList.add("other");
    }

    div.innerHTML = `
      <div class="msg-header">
        <img src="${msg.avatar_url}" class="avatar">
        <strong>${msg.username}</strong>
      </div>
      <p>${msg.content}</p>
      <span>${new Date(msg.created_at).toLocaleTimeString()}</span>
    `;

    container.appendChild(div);
  });

  container.scrollTop = container.scrollHeight;
}

loadMessages();

// ===============================
//  ENVOYER UN MESSAGE
// ===============================
const sendBtn = document.getElementById("sendBtn");
const input = document.getElementById("messageInput");

sendBtn.addEventListener("click", async () => {
  const content = input.value.trim();
  if (content === "") return;

  if (!currentUser) {
    console.error("Utilisateur non connecté");
    return;
  }

  // 🔥 Récupérer pseudo + PP
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("username, avatar_url")
    .eq("id", currentUser.id)
    .single();

  if (profileError) {
    console.error("Erreur profil:", profileError);
    return;
  }

  // 🔥 Envoyer le message avec pseudo + PP
  const { error } = await supabase.from("messages").insert([
    {
      content,
      user_id: currentUser.id,
      username: profile.username,
      avatar_url: profile.avatar_url
    }
  ]);

  await supabase.from("messages").insert({
  content: message,
  user_id: currentUser.id
});

// Appel de la notif
await fetch("https://frtvvqdvdwjzrxnvcrgy.supabase.co/functions/v1/notify", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    message: message,
    user: currentUser.id
  })
});

  if (error) {
    console.error("Erreur sendMessage:", error);
    return;
  }

  input.value = "";
});

// ===============================
//  TEMPS RÉEL : NOUVEAUX MESSAGES
// ===============================
supabase
  .channel("realtime-messages")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "messages" },
    (payload) => {
      const msg = payload.new;

      const container = document.getElementById("messages");

      const div = document.createElement("div");
      div.classList.add("message");

      if (currentUser && msg.user_id === currentUser.id) {
        div.classList.add("me");
      } else {
        div.classList.add("other");
      }

      div.innerHTML = `
        <div class="msg-header">
          <img src="${msg.avatar_url}" class="avatar">
          <strong>${msg.username}</strong>
        </div>
        <p>${msg.content}</p>
        <span>${new Date(msg.created_at).toLocaleTimeString()}</span>
      `;

      container.appendChild(div);
      container.scrollTop = container.scrollHeight;
    }
  )
  .subscribe();
