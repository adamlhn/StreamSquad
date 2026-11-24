// Mode clair / sombre (F13)
const boutonTheme = document.getElementById("bouton-theme");

// met la page en mode "clair" ou "sombre"
function appliquerTheme(theme) {
  if (theme === "clair") {
    document.body.classList.add("clair");
    boutonTheme.textContent = "🌙";
  } else {
    document.body.classList.remove("clair");
    boutonTheme.textContent = "☀️";
  }
}

// on reprend le thème choisi la dernière fois (sombre par défaut)
let themeActuel = localStorage.getItem("theme") || "sombre";
appliquerTheme(themeActuel);

// au clic : on passe à l'autre thème et on le retient
boutonTheme.addEventListener("click", () => {
  if (themeActuel === "clair") {
    themeActuel = "sombre";
  } else {
    themeActuel = "clair";
  }
  localStorage.setItem("theme", themeActuel);
  appliquerTheme(themeActuel);
});