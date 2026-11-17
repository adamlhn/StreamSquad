
class Connexion {
  constructor() {
    this.socket = io();
  }

  creerSalon(pseudo) {
    this.socket.emit("salon:creer", {
      pseudo: pseudo
    });
  }

  rejoindreSalon(code, pseudo) {
    this.socket.emit("salon:rejoindre", {
      code: code,
      pseudo: pseudo
    });
  }

  ecouter(evenement, fonction) {
    this.socket.on(evenement, fonction);
  }

  envoyer(evenement, donnees) {
    this.socket.emit(evenement, donnees);
  }
}
