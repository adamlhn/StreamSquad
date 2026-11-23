class Lecteur {
  constructor(idElement, envoyer, quandBloque) {
    this.envoyer = envoyer;
    this.idVideo = null;
    this.ignorerJusqua = 0;
    this.quandBloque = quandBloque;
    this.lectureDemandee = false;
    this.player = new YT.Player(idElement, {
      width: 640,
      height: 360,
      events: {
        onReady: () => this.quandPret(),
        onStateChange: (event) => this.quandEtatChange(event),
        onError: (event) => console.log("Erreur YouTube :", event.data),
      },
    });
  }

  quandPret() {
    this.player.mute();
  }

  silence() {
    this.ignorerJusqua = Date.now() + 1000;
  }

  seCaler(position) {
    if (Math.abs(this.player.getCurrentTime() - position) > 1.5) {
      this.silence();
      this.player.seekTo(position, true);
    }
  }

  appliquerEtat(etat) {
    this.lectureDemandee = etat.enLecture;
    if (this.lectureDemandee) {
      setTimeout(() => {
        const bloque = this.player.getPlayerState() !== YT.PlayerState.PLAYING;
        if (this.lectureDemandee && bloque) {
          this.quandBloque();
        }
      }, 1500);
    }

    let positionAttendue = etat.position;
    if (etat.enLecture) {
      positionAttendue += (Date.now() - etat.envoyeLe) / 1000;
    }

    if (etat.idVideo !== this.idVideo) {
      this.idVideo = etat.idVideo;
      this.silence();
      if (etat.enLecture) {
        this.player.loadVideoById({
          videoId: etat.idVideo,
          startSeconds: positionAttendue,
        });
      } else {
        this.player.cueVideoById({
          videoId: etat.idVideo,
          startSeconds: positionAttendue,
        });
      }
      return;
    }
    this.seCaler(positionAttendue);

    const enLectureIci = this.player.getPlayerState() === YT.PlayerState.PLAYING;
    if (etat.enLecture && !enLectureIci) {
      this.silence();
      this.player.playVideo();
    }
    if (!etat.enLecture && enLectureIci) {
      this.silence();
      this.player.pauseVideo();
    }
  }

  quandEtatChange(event) {
    if (Date.now() < this.ignorerJusqua) {
      if (event.data === YT.PlayerState.BUFFERING) {
        this.silence();
      }
      return;
    }

    if (event.data === YT.PlayerState.PLAYING) {
      this.envoyer("video:play", { position: this.player.getCurrentTime() });
    }
    if (event.data === YT.PlayerState.PAUSED) {
      this.envoyer("video:pause", { position: this.player.getCurrentTime() });
    }
    if (event.data === YT.PlayerState.ENDED) {
      this.envoyer("video:fin", { idVideo: this.idVideo });
    }
  }
  sauterA(position) {
    this.silence();
    this.player.seekTo(position, true);
    this.envoyer("video:seek", { position: position });
  }

  rejoindre() {
    this.player.unMute();
    const enLectureIci = this.player.getPlayerState() === YT.PlayerState.PLAYING;
    if (this.lectureDemandee && !enLectureIci) {
      this.silence();
      this.player.playVideo();
    }
  }
}
