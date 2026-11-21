const extraireIdVideo = require("./extraireIdVideo");

class Playlist {
  constructor() {
    this.videos = [];
  }

  ajouter(url) {
    const id = extraireIdVideo(url);
    if (id === null) {
      return null;
    }
    this.videos.push(id);
    return id;
  }

  suivante() {
    const id = this.videos.shift();
    return id === undefined ? null : id;
  }

  estVide() {
    return this.videos.length === 0;
  }

  liste() {
    return [...this.videos];
  }
}

module.exports = Playlist;