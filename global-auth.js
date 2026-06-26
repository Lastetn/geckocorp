
import { supabase } from "./supabase.js";

// Afficher / cacher Connexion / Déconnexion
supabase.auth.getUser().then(({ data }) => {
    const loginLink = document.getElementById("login-link");
    const logoutLink = document.getElementById("logout-link");

    if (!loginLink || !logoutLink) return;

    if (data.user) {
        loginLink.style.display = "none";
        logoutLink.style.display = "inline";
    } else {
        loginLink.style.display = "inline";
        logoutLink.style.display = "none";
    }
});

// Déconnexion
const logoutLink = document.getElementById("logout-link");

if (logoutLink) {
    logoutLink.addEventListener("click", async () => {
        await supabase.auth.signOut();
        window.location.href = "login.html";
    });
}
