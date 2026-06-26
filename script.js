
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
