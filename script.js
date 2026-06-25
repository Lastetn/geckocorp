
/* 
    Petite animation : le titre grossit légèrement au chargement
*/
window.onload = () => {
    const titre = document.querySelector("h1");
    titre.style.transition = "0.6s";
    titre.style.transform = "scale(1.05)";
    setTimeout(() => {
        titre.style.transform = "scale(1)";
    }, 600);
};

// Thème sombre / clair
const toggle = document.getElementById("theme-toggle");

// Charger le thème sauvegardé
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    toggle.textContent = "☀️";
}

toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        toggle.textContent = "☀️";
        localStorage.setItem("theme", "dark");
    } else {
        toggle.textContent = "🌙";
        localStorage.setItem("theme", "light");
    }
});

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://frtvvqdvdwjzrxnvcrgy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZydHZ2cWR2ZHdqenJ4bnZjcmd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzODExNTYsImV4cCI6MjA5Nzk1NzE1Nn0.ip-Gx4OjjEAAvCDdNjJXLonUAtaEll5nUJRalaYh6Cs";
const supabase = createClient(supabaseUrl, supabaseKey);

// Afficher / cacher Connexion / Déconnexion
async function updateAuthUI() {
    const { data } = await supabase.auth.getUser();
    const loginLink = document.getElementById("login-link");
    const logoutLink = document.getElementById("logout-link");

    if (data.user) {
        loginLink.style.display = "none";
        logoutLink.style.display = "inline";
    } else {
        loginLink.style.display = "inline";
        logoutLink.style.display = "none";
    }
}

updateAuthUI();

// Déconnexion
document.getElementById("logout-link")?.addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.reload();
});