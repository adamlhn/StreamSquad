function brancherChat(io, socket, serveur) {
  socket.on("chat:envoyer", (donnees) => {
    try {
      const code = socket.data.code;
      if (code === undefined) {
        throw new Error("Il faut être dans un salon pour envoyer un message");
      }
      const salon = serveur.trouverSalon(code);
      if (salon === null) {
        throw new Error("Ce salon n'existe pas");
      }
      const message = salon.ajouterMessage(socket.id, donnees.texte);
      io.to(code).emit("chat:message", message.versObjet());
    } catch (e) {
      socket.emit("erreur", { message: e.message });
    }
  });
}

module.exports = brancherChat;
