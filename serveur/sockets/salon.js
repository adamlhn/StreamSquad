function brancherSalon(io, socket, serveur) {
  function entrer(salon, pseudo) {
    const participant = salon.ajouterParticipant(socket.id, pseudo);
    serveur.annulerFermeture(salon.code);
    socket.join(salon.code);
    socket.data.code = salon.code;
    const etat = salon.etatComplet();
    etat.moi = participant.versObjet();
    socket.emit("salon:rejoint", etat);
    io.to(salon.code).emit("participants:liste", salon.listeParticipants());
  }

  function sortir() {
    const code = socket.data.code;
    if (code === undefined) {
      return;
    }
    socket.data.code = undefined;
    socket.leave(code);
    const salon = serveur.trouverSalon(code);
    if (salon === null) {
      return;
    }
    salon.retirerParticipant(socket.id);
    if (salon.estVide()) {
      serveur.planifierFermeture(code);
    } else {
      io.to(code).emit("participants:liste", salon.listeParticipants());
    }
  }

  socket.on("salon:creer", (donnees) => {
    sortir();
    const salon = serveur.creerSalon();
    try {
      entrer(salon, donnees.pseudo);
    } catch (e) {
      serveur.fermerSalon(salon.code);
      socket.emit("erreur", { message: e.message });
    }
  });

  socket.on("salon:rejoindre", (donnees) => {
    try {
      const salon = serveur.trouverSalon(donnees.code);
      if (salon === null) {
        throw new Error("Ce salon n'existe pas");
      }
      if (socket.data.code !== salon.code) {
        sortir();
      }
      entrer(salon, donnees.pseudo);
    } catch (e) {
      socket.emit("erreur", { message: e.message });
    }
  });

  socket.on("salon:quitter", () => {
    sortir();
  });

  socket.on("disconnect", () => {
    sortir();
  });
}

module.exports = brancherSalon;
