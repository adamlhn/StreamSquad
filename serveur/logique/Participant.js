class Participant {
  constructor(id, pseudo) {
    const pseudoNettoye = String(pseudo).trim();
    if (pseudoNettoye.length < 2 || pseudoNettoye.length > 20) {
      throw new Error("Le pseudo doit faire entre 2 et 20 caractères");
    }
    this.id = id;
    this.pseudo = pseudoNettoye;
  }

  versObjet() {
    return { id: this.id, pseudo: this.pseudo };
  }
}

module.exports = Participant;