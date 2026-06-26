import { supabase } from "./supabase.js";
const loginLink = document.getElementById("login-link");
const logoutLink = document.getElementById("logout-link");

// Vérifier si l'utilisateur est connecté
supabase.auth.getUser().then(({ data }) => {
    if (data.user) {
        loginLink.style.display = "none";
        logoutLink.style.display = "inline";
    } else {
        loginLink.style.display = "inline";
        logoutLink.style.display = "none";
    }
});

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

// Déconnexion
const logoutLink = document.getElementById("logout-link");

if (logoutLink) {
    logoutLink.addEventListener("click", async () => {
        await supabase.auth.signOut();
        window.location.href = "login.html";
    });
}
