import { supabase } from "./supabase.js";

(async () => {
    // Récupérer l'utilisateur
    const { data: { user } } = await supabase.auth.getUser();

    const loginLink = document.getElementById("login-link");
    const logoutLink = document.getElementById("logout-link");

    if (loginLink && logoutLink) {
        if (user) {
            loginLink.style.display = "none";
            logoutLink.style.display = "inline";
        } else {
            loginLink.style.display = "inline";
            logoutLink.style.display = "none";
        }
    }

    // ➜ Créer le profil si absent
    if (user) {
        const { data: existing } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", user.id)
            .single();

        if (!existing) {
            await supabase.from("profiles").insert({
                id: user.id,
                username: "Nouvel utilisateur",
                avatar_url: "default.png"
            });
        }
    }

    // Déconnexion
    const logoutLinkEl = document.getElementById("logout-link");
    if (logoutLinkEl) {
        logoutLinkEl.addEventListener("click", async () => {
            await supabase.auth.signOut();
            window.location.href = "login.html";
        });
    }
})();
