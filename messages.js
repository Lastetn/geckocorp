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
        <img src="${msg.avatar_url || 'default.png'}" class="avatar">
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
  const message = input.value.trim();
  if (message === "") return;

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
      content: message,
      user_id: currentUser.id,
      username: profile.username,
      avatar_url: profile.avatar_url
    }
  ]);

  if (error) {
    console.error("Erreur sendMessage:", error);
    return;
  }

  // ===============================
  //  🔥 APPEL À LA FUNCTION NOTIFY
  // ===============================

  // Récupérer tous les emails des utilisateurs
  const { data: users } = await supabase
    .from("profiles")
    .select("id, email");

  const emails = users
  .map(u => u.email)
  .filter(email => email && email.includes("@"));

  // Appeler la Function Supabase (pas Resend)
await fetch("https://frtvvqdvdwjzrxnvcrgy.supabase.co/functions/v1/notify3", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: message,
      emails: emails
    })
  });

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
          <img src="${msg.avatar_url || 'default.png'}" class="avatar">
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
