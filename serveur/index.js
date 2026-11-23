// Point d'entrée : lance Express (les pages) et Socket.io (le temps réel)
const http = require("http");
const path = require("path");
const express = require("express");
const { Server } = require("socket.io");

const Serveur = require("./logique/Serveur");
const brancherSalon = require("./sockets/salon");
const brancherVideo = require("./sockets/video");

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static(path.join(__dirname, "..", "public")));

const httpServeur = http.createServer(app);
const io = new Server(httpServeur);

// le Serveur envoie l'état de lecture à tout un salon toutes les 2 s (RG7)
const serveur = new Serveur((code, etat) => {
  io.to(code).emit("video:etat", etat);
});
serveur.demarrerSynchro();

io.on("connection", (socket) => {
  brancherSalon(io, socket, serveur);
  brancherVideo(io, socket, serveur);
  // les autres lots ajouteront ici : brancherChat, brancherPlaylist
});

httpServeur.listen(PORT, () => {
  console.log("StreamSquad : http://localhost:" + PORT);
});
