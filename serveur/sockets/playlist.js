const gererFinDeVideo = require("../logique/finDeVideo");

function brancherPlaylist(io, socket, serveur) {
  // le salon où se trouve ce socket (null s'il n'est dans aucun salon)
  function salonCourant() {
    const code = socket.data.code;
    if (code === undefined) {
      return null;
    }
    return serveur.trouverSalon(code);
  }

  // un participant ajoute une vidéo à la playlist
  socket.on("playlist:ajouter", (donnees) => {
    const salon = salonCourant();
    if (salon === null) {
      socket.emit("erreur", { message: "Il faut être dans un salon" });
      return;
    }
    const id = salon.playlist.ajouter(donnees && donnees.url);
    if (id === null) {
      socket.emit("erreur", { message: "Lien YouTube invalide" });
      return;
    }
    io.to(salon.code).emit("playlist:liste", salon.playlist.liste());
  });

  // une vidéo est terminée : on lance la suivante ou on arrête
  socket.on("video:fin", (donnees) => {
    const salon = salonCourant();
    if (salon === null) {
      return;
    }
    const resultat = gererFinDeVideo(salon.lecture, salon.playlist, donnees && donnees.idVideo);
    if (resultat.action === "ignoree") {
      return;
    }
    io.to(salon.code).emit("video:etat", salon.lecture.etat());
    io.to(salon.code).emit("playlist:liste", salon.playlist.liste());
  });
}

module.exports = brancherPlaylist;