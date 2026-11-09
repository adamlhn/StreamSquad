class Lecture {
  constructor() {
    this.idVideo = null;
    this.position = 0;
    this.enLecture = false;
    this.misAJourLe = Date.now();
  }

  positionActuelle() {
    // si en lecture : position + temps écoulé depuis misAJourLe (en secondes)
    if (this.enLecture) {
      const ecoule = (Date.now() - this.misAJourLe) / 1000;
      return this.position + ecoule;
    }
    return this.position;
  }

  play(position) {
    this.enLecture = true;
    this.position = position;
    this.misAJourLe = Date.now();
  }

  pause(position) {
    this.enLecture = false;
    this.position = position;
    this.misAJourLe = Date.now();
  }

  seek(position) {
    this.position = position;
    this.misAJourLe = Date.now();
  }

  etat() {
    return {
      idVideo: this.idVideo,
      position: this.positionActuelle(),
      enLecture: this.enLecture,
      envoyeLe: Date.now(),
    };
  }

  charger(idVideo) {
    this.idVideo = idVideo;
    this.position = 0;
    this.enLecture = false;
    this.misAJourLe = Date.now();
  }
}

module.exports = Lecture;
