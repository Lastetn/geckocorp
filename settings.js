
import { supabase } from "./supabase.js";

let currentUser = null;

// Récupérer l'utilisateur connecté
async function getCurrentUser() {
    const { data } = await supabase.auth.getUser();
    currentUser = data.user;
}
await getCurrentUser();

// Charger les infos actuelles
async function loadProfile() {
    const { data: profile } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", currentUser.id)
        .single();

    document.getElementById("usernameInput").value = profile.username;
    document.getElementById("avatarInput").value = profile.avatar_url;
}
loadProfile();

// Sauvegarder
document.getElementById("saveBtn").addEventListener("click", async () => {
    const username = document.getElementById("usernameInput").value.trim();
    const avatar = document.getElementById("avatarInput").value.trim();

    const { error } = await supabase
        .from("profiles")
        .update({
            username: username,
            avatar_url: avatar
        })
        .eq("id", currentUser.id);

    if (error) {
        document.getElementById("status").textContent = "Erreur : " + error.message;
        return;
    }

    document.getElementById("status").textContent = "✔ Informations mises à jour !";
});
