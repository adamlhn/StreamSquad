// Classe Connexion : échange les messages avec le serveur (lot C)
// Les noms des messages suivent le tableau du rapport de conception (domaine:action).
class Connexion {
  constructor() {
    this.socket = io();
  }

  // --- Salon ---
  creerSalon(pseudo) {
    this.socket.emit("salon:creer", { pseudo: pseudo });
  }

  rejoindreSalon(code, pseudo) {
    this.socket.emit("salon:rejoindre", { code: code, pseudo: pseudo });
  }

  quitterSalon() {
    this.socket.emit("salon:quitter");
  }

  // --- Chat ---
  envoyerMessage(texte) {
    this.socket.emit("chat:envoyer", { texte: texte });
  }

  // --- Vidéo et playlist ---
  chargerVideo(url) {
    this.socket.emit("video:charger", { url: url });
  }

  ajouterALaPlaylist(url) {
    this.socket.emit("playlist:ajouter", { url: url });
  }

  // --- Outils génériques ---
  ecouter(evenement, fonction) {
    this.socket.on(evenement, fonction);
  }

  envoyer(evenement, donnees) {
    this.socket.emit(evenement, donnees);
  }
}
