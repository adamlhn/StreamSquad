
const connexion = new Connexion();

const formulaireCreer = document.getElementById("form-creer");
const formulaireRejoindre = document.getElementById("form-rejoindre");
const messageErreur = document.getElementById("message-erreur");

function afficherErreur(message) {
  messageErreur.textContent = message;
}

formulaireCreer.addEventListener("submit", (event) => {
  event.preventDefault();
  afficherErreur("");

  const pseudo = document.getElementById("pseudo-creer").value.trim();

  if (pseudo.length < 2 || pseudo.length > 20) {
    afficherErreur("Le pseudo doit contenir entre 2 et 20 caractères.");
    return;
  }

  connexion.creerSalon(pseudo);
});

formulaireRejoindre.addEventListener("submit", (event) => {
  event.preventDefault();
  afficherErreur("");

  const pseudo = document.getElementById("pseudo-rejoindre").value.trim();
  const code = document.getElementById("code-salon").value.trim().toUpperCase();

  if (pseudo.length < 2 || pseudo.length > 20) {
    afficherErreur("Le pseudo doit contenir entre 2 et 20 caractères.");
    return;
  }

  if (!/^[A-HJ-NP-Z2-9]{6}$/.test(code)) {
    afficherErreur("Le code du salon est invalide.");
    return;
  }

  connexion.rejoindreSalon(code, pseudo);
});

connexion.ecouter("salon:rejoint", (salon) => {
  console.log("Salon rejoint :", salon);
});

connexion.ecouter("erreur", (erreur) => {
  afficherErreur(erreur.message || "Une erreur est survenue.");
});
