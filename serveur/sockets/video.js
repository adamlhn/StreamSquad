const extraireIdVideo = require("../logique/extraireIdVideo");

function brancherVideo(io, socket, serveur) {
  function salonActuel() {
    if (socket.data.code === undefined) {
      return null;
    }
    return serveur.trouverSalon(socket.data.code);
  }

  function envoyerEtat(salon) {
    io.to(salon.code).emit("video:etat", salon.lecture.etat());
  }

  function positionValide(data) {
    return data !== undefined && typeof data.position === "number";
  }

  socket.on("video:play", (data) => {
    const salon = salonActuel();
    if (salon === null || !positionValide(data)) {
      return;
    }
    salon.lecture.play(data.position);
    envoyerEtat(salon);
  });

  socket.on("video:pause", (data) => {
    const salon = salonActuel();
    if (salon === null || !positionValide(data)) {
      return;
    }
    salon.lecture.pause(data.position);
    envoyerEtat(salon);
  });

  socket.on("video:seek", (data) => {
    const salon = salonActuel();
    if (salon === null || !positionValide(data)) {
      return;
    }
    salon.lecture.seek(data.position);
    envoyerEtat(salon);
  });

  socket.on("video:charger", (data) => {
    const salon = salonActuel();
    if (salon === null || data === undefined) {
      return;
    }
    const id = extraireIdVideo(data.url);
    if (id === null) {
      socket.emit("erreur", { code: "URL_INVALIDE", message: "Lien YouTube non valide" });
      return;
    }
    salon.lecture.charger(id);
    envoyerEtat(salon);
  });
}

module.exports = brancherVideo;
