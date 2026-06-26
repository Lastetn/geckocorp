
// ===============================
//  CONFIG SUPABASE
// ===============================
const supabaseUrl = "TON_URL_SUPABASE";
const supabaseKey = "TA_CLE_ANON";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

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
