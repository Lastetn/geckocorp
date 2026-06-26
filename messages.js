
// ===============================
//  CONFIG SUPABASE
// ===============================
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://frtvvqdvdwjzrxnvcrgy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZydHZ2cWR2ZHdqenJ4bnZjcmd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzODExNTYsImV4cCI6MjA5Nzk1NzE1Nn0.ip-Gx4OjjEAAvCDdNjJXLonUAtaEll5nUJRalaYh6Cs";

const supabase = createClient(supabaseUrl, supabaseKey);
// ===============================
//  CHARGER LES MESSAGES
// ===============================
async function loadMessages() {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur loadMessages:", error);
    return;
  }

  const container = document.getElementById("messages-container");
  container.innerHTML = "";

  data.forEach((msg) => {
    const div = document.createElement("div");
    div.classList.add("message");

    div.innerHTML = `
      <p>${msg.content}</p>
      <span>${new Date(msg.created_at).toLocaleTimeString()}</span>
    `;

    container.appendChild(div);
  });
}

loadMessages();

// ===============================
//  ENVOYER UN MESSAGE
// ===============================
const form = document.getElementById("message-form");
const input = document.getElementById("message-input");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const content = input.value.trim();
  if (content === "") return;

  const { error } = await supabase.from("messages").insert([{ content }]);

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

      const container = document.getElementById("messages-container");

      const div = document.createElement("div");
      div.classList.add("message");

      div.innerHTML = `
        <p>${msg.content}</p>
        <span>${new Date(msg.created_at).toLocaleTimeString()}</span>
      `;

      container.prepend(div);
    }
  )
  .subscribe();
