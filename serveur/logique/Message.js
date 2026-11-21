class Message {
  constructor(pseudo, texte) {
    const texteNettoye = String(texte).trim();
    if (texteNettoye.length < 1 || texteNettoye.length > 500) {
      throw new Error("Le message doit faire entre 1 et 500 caractères");
    }
    this.pseudo = pseudo;
    this.texte = texteNettoye;
    this.envoyeLe = Date.now();
  }

  versObjet() {
    return { pseudo: this.pseudo, texte: this.texte, envoyeLe: this.envoyeLe };
  }
}

module.exports = Message;