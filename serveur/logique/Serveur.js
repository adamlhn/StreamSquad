const Salon = require("./Salon");
// const Playlist = require("./Playlist"); // playlist (lot D)

// sans O 0 I 1 (RG1)
const CARACTERES = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const LONGUEUR_CODE = 6;
const DELAI_FERMETURE = 5 * 60 * 1000; // 5 min (RG9)
const INTERVALLE_SYNCHRO = 2000; // 2 s (RG7)

class Serveur {
  // envoyer : fourni par index.js
  constructor(envoyer, delaiFermeture = DELAI_FERMETURE) {
    this.salons = new Map(); // code -> Salon
    this.minuteurs = new Map(); // code -> minuteur
    this.envoyer = envoyer;
    this.delaiFermeture = delaiFermeture;
    this.synchro = null;
  }

  // code aléatoire
  genererCode() {
    let code = "";
    for (let i = 0; i < LONGUEUR_CODE; i++) {
      const position = Math.floor(Math.random() * CARACTERES.length);
      code = code + CARACTERES[position];
    }
    return code;
  }

  creerSalon() {
    // code unique
    let code = this.genererCode();
    while (this.salons.has(code)) {
      code = this.genererCode();
    }
    const salon = new Salon(code);
    // const salon = new Salon(code, new Playlist()); // playlist (lot D)
    this.salons.set(code, salon);
    return salon;
  }

  // null si inconnu
  trouverSalon(code) {
    const salon = this.salons.get(String(code).trim().toUpperCase());
    if (salon === undefined) {
      return null;
    }
    return salon;
  }

  fermerSalon(code) {
    this.annulerFermeture(code);
    this.salons.delete(code);
  }

  // dernier départ (RG9)
  planifierFermeture(code) {
    this.annulerFermeture(code);
    const minuteur = setTimeout(() => {
      // revérif salon vide
      const salon = this.salons.get(code);
      if (salon !== undefined && salon.estVide()) {
        this.fermerSalon(code);
      }
    }, this.delaiFermeture);
    this.minuteurs.set(code, minuteur);
  }

  // retour avant 5 min
  annulerFermeture(code) {
    const minuteur = this.minuteurs.get(code);
    if (minuteur !== undefined) {
      clearTimeout(minuteur);
      this.minuteurs.delete(code);
    }
  }

  // synchro vidéo (RG7)
  diffuserEtat() {
    for (const salon of this.salons.values()) {
      if (!salon.estVide()) {
        this.envoyer(salon.code, salon.lecture.etat());
      }
    }
  }

  demarrerSynchro() {
    // une seule synchro
    if (this.synchro === null) {
      this.synchro = setInterval(() => this.diffuserEtat(), INTERVALLE_SYNCHRO);
    }
  }

  arreterSynchro() {
    clearInterval(this.synchro);
    this.synchro = null;
  }
}

module.exports = Serveur;
