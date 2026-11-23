const Serveur = require("../serveur/logique/Serveur");
const brancherSalon = require("../serveur/sockets/salon");
const brancherChat = require("../serveur/sockets/chat");
 
const envoisSalon = [];
const io = {
  to(code) {
    return {
      emit(evenement, donnees) {
        envoisSalon.push({ code: code, evenement: evenement, donnees: donnees });
      },
    };
  },
};
 
function fauxSocket(id) {
  const socket = {
    id: id,
    data: {},
    rooms: [],
    recus: [],
    ecouteurs: {},
    on(evenement, fonction) {
      this.ecouteurs[evenement] = fonction;
    },
    emit(evenement, donnees) {
      this.recus.push({ evenement: evenement, donnees: donnees });
    },
    join(code) {
      this.rooms.push(code);
    },
    leave(code) {
      this.rooms = this.rooms.filter((r) => r !== code);
    },
    envoyer(evenement, donnees) {
      this.ecouteurs[evenement](donnees);
    },
    dernier() {
      return this.recus[this.recus.length - 1];
    },
  };
  brancherSalon(io, socket, serveur);
  brancherChat(io, socket, serveur);
  return socket;
}
 
function dernierEnvoiSalon() {
  return envoisSalon[envoisSalon.length - 1];
}
 
const serveur = new Serveur(() => {}, 1000);
 
const a = fauxSocket("socket-a");
a.envoyer("salon:creer", { pseudo: "Sophiane" });
const code = a.dernier().donnees.code;
const b = fauxSocket("socket-b");
b.envoyer("salon:rejoindre", { code: code, pseudo: "Adam" });
 
a.envoyer("chat:envoyer", { texte: "  Salut Adam  " });
const envoi = dernierEnvoiSalon();
console.log("Test 1 - chat:message diffusé :", envoi.evenement);
console.log("Test 2 - au bon salon (true) :", envoi.code === code);
console.log("Test 3 - message nettoyé :", envoi.donnees);
 
b.envoyer("chat:envoyer", { texte: "Salut !" });
console.log("Test 4 - pseudo trouvé par le serveur (Adam) :", dernierEnvoiSalon().donnees.pseudo);
 
const avant = envoisSalon.length;
a.envoyer("chat:envoyer", { texte: "    " });
console.log("Test 5 - message vide refusé :", a.dernier());
console.log("Test 6 - rien diffusé (true) :", envoisSalon.length === avant);
 
a.envoyer("chat:envoyer", { texte: "a".repeat(501) });
console.log("Test 7 - message trop long refusé :", a.dernier());
 
const c = fauxSocket("socket-c");
c.envoyer("chat:envoyer", { texte: "coucou" });
console.log("Test 8 - hors salon refusé :", c.dernier());
 
const d = fauxSocket("socket-d");
d.envoyer("salon:rejoindre", { code: code, pseudo: "Racha" });
console.log("Test 9 - historique reçu en arrivant (2) :", d.dernier().donnees.messages.length);
 
b.envoyer("salon:quitter");
b.envoyer("chat:envoyer", { texte: "encore là ?" });
console.log("Test 10 - après salon:quitter refusé :", b.dernier());
 
for (let i = 1; i <= 60; i++) {
  a.envoyer("chat:envoyer", { texte: "message " + i });
}
const e = fauxSocket("socket-e");
e.envoyer("salon:rejoindre", { code: code, pseudo: "Kamelia" });
const historique = e.dernier().donnees.messages;
console.log("Test 11 - 50 derniers messages gardés (50) :", historique.length);
console.log("Test 12 - du plus ancien au plus récent :", historique[0].texte, "->", historique[49].texte);
 
a.envoyer("chat:envoyer");
console.log("Test 13 - données manquantes refusées :", a.dernier().evenement);
 