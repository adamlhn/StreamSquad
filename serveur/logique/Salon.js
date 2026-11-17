const Participant = require("./Participant");
const Message = require("./Message");
const Lecture = require("./Lecture");

const MAX_MESSAGES = 50;

class Salon {
  constructor(code, playlist = null) {
    this.code = code;
    this.participants = new Map(); // clé : id du socket, valeur : Participant
    this.messages = [];
    this.lecture = new Lecture();
    this.playlist = playlist;
  }

  ajouterParticipant(id, pseudo) {
    if (this.participants.has(id)) {
      throw new Error("Ce participant est déjà dans le salon");
    }
    const participant = new Participant(id, pseudo);
    participant.pseudo = this.pseudoLibre(participant.pseudo);
    this.participants.set(id, participant);
    return participant;
  }

  pseudoPris(pseudo) {
    for (const p of this.participants.values()) {
      if (p.pseudo === pseudo) {
        return true;
      }
    }
    return false;
  }

  pseudoLibre(pseudo) {
    if (!this.pseudoPris(pseudo)) {
      return pseudo;
    }
    let numero = 2;
    while (this.pseudoPris(pseudo + "_" + numero)) {
      numero++;
    }
    return pseudo + "_" + numero;
  }

  retirerParticipant(id) {
    const participant = this.participants.get(id);
    if (participant === undefined) {
      return null;
    }
    this.participants.delete(id);
    return participant;
  }

  estVide() {
    return this.participants.size === 0;
  }

  ajouterMessage(id, texte) {
    const participant = this.participants.get(id);
    if (participant === undefined) {
      throw new Error("Il faut être dans le salon pour envoyer un message");
    }
    const message = new Message(participant.pseudo, texte);
    this.messages.push(message);
    if (this.messages.length > MAX_MESSAGES) {
      this.messages.shift();
    }
    return message;
  }

  listeParticipants() {
    const liste = [];
    for (const p of this.participants.values()) {
      liste.push(p.versObjet());
    }
    return liste;
  }

  etatComplet() {
    return {
      code: this.code,
      participants: this.listeParticipants(),
      messages: this.messages.map((m) => m.versObjet()),
      lecture: this.lecture.etat(),
      playlist: this.playlist ? this.playlist.liste() : [],
    };
  }
}

module.exports = Salon;
