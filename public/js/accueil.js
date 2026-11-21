// Page d'accueil : créer ou rejoindre un salon (lot C)
const connexion = new Connexion();
const pageSalon = new PageSalon(connexion);

const pageAccueil = document.getElementById("page-accueil");
const formulaireCreer = document.getElementById("form-creer");
const formulaireRejoindre = document.getElementById("form-rejoindre");
const champCode = document.getElementById("code-salon");
const messageErreur = document.getElementById("message-erreur");

function afficherErreur(message) {
  messageErreur.textContent = message;
}

function pseudoValide(pseudo) {
  if (pseudo.length < 2 || pseudo.length > 20) {
    afficherErreur("Le pseudo doit contenir entre 2 et 20 caractères.");
    return false;
  }
  return true;
}

// lien partagé (?code=ABC234) : on pré-remplit le code
const codeDansLien = new URLSearchParams(location.search).get("code");
if (codeDansLien !== null) {
  champCode.value = codeDansLien.toUpperCase();
  document.getElementById("pseudo-rejoindre").focus();
}

// le code s'écrit toujours en majuscules
champCode.addEventListener("input", () => {
  champCode.value = champCode.value.toUpperCase();
});

formulaireCreer.addEventListener("submit", (event) => {
  event.preventDefault();
  afficherErreur("");

  const pseudo = document.getElementById("pseudo-creer").value.trim();
  if (pseudoValide(pseudo)) {
    connexion.creerSalon(pseudo);
  }
});

formulaireRejoindre.addEventListener("submit", (event) => {
  event.preventDefault();
  afficherErreur("");

  const pseudo = document.getElementById("pseudo-rejoindre").value.trim();
  const code = champCode.value.trim().toUpperCase();

  if (!pseudoValide(pseudo)) {
    return;
  }
  // 6 caractères, sans O 0 I 1 (RG1)
  if (!/^[A-HJ-NP-Z2-9]{6}$/.test(code)) {
    afficherErreur("Le code du salon est invalide.");
    return;
  }

  connexion.rejoindreSalon(code, pseudo);
});

// le serveur a accepté : on passe de l'accueil au salon
connexion.ecouter("salon:rejoint", (etat) => {
  afficherErreur("");
  pageAccueil.hidden = true;
  pageSalon.ouvrir(etat);
});

connexion.ecouter("erreur", (erreur) => {
  const texte = erreur.message || "Une erreur est survenue.";
  if (pageAccueil.hidden) {
    notifier(texte, true); // dans le salon
  } else {
    afficherErreur(texte); // sur l'accueil
  }
});

// bouton "Quitter" : retour à l'accueil
document.getElementById("bouton-quitter").addEventListener("click", () => {
  pageSalon.fermer();
  pageAccueil.hidden = false;
});

// appelée automatiquement par l'API YouTube quand elle est chargée
function onYouTubeIframeAPIReady() {
  pageSalon.creerLecteur();
}
