const Salon = require("./Salon");
const Playlist = require("./Playlist");

const CARACTERES = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const LONGUEUR_CODE = 6;
const DELAI_FERMETURE = 5 * 60 * 1000;
const INTERVALLE_SYNCHRO = 2000;

class Serveur {
  constructor(envoyer, delaiFermeture = DELAI_FERMETURE) {
    this.salons = new Map();
    this.minuteurs = new Map();
    this.envoyer = envoyer;
    this.delaiFermeture = delaiFermeture;
    this.synchro = null;
  }

  genererCode() {
    let code = "";
    for (let i = 0; i < LONGUEUR_CODE; i++) {
      const position = Math.floor(Math.random() * CARACTERES.length);
      code = code + CARACTERES[position];
    }
    return code;
  }

  creerSalon() {
    let code = this.genererCode();
    while (this.salons.has(code)) {
      code = this.genererCode();
    }
    const salon = new Salon(code, new Playlist());
    this.salons.set(code, salon);
    return salon;
  }

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

  planifierFermeture(code) {
    this.annulerFermeture(code);
    const minuteur = setTimeout(() => {
      const salon = this.salons.get(code);
      if (salon !== undefined && salon.estVide()) {
        this.fermerSalon(code);
      }
    }, this.delaiFermeture);
    this.minuteurs.set(code, minuteur);
  }

  annulerFermeture(code) {
    const minuteur = this.minuteurs.get(code);
    if (minuteur !== undefined) {
      clearTimeout(minuteur);
      this.minuteurs.delete(code);
    }
  }

  diffuserEtat() {
    for (const salon of this.salons.values()) {
      if (!salon.estVide()) {
        this.envoyer(salon.code, salon.lecture.etat());
      }
    }
  }

  demarrerSynchro() {
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
