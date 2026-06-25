

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
  const { data: messages, error } = await supabase
    .from("messages")
    .select("content, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Erreur SELECT :", error);
    return;
  }

  const box = document.getElementById("messagesBox");
  box.innerHTML = "";

  messages.forEach(msg => {
    const div = document.createElement("div");
    div.classList.add("message");
    div.textContent = msg.content;
    box.appendChild(div);
  });
}
