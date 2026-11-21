const Serveur = require("../serveur/logique/Serveur");
const brancherSalon = require("../serveur/sockets/salon");
 
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
  return socket;
}
 
const serveur = new Serveur(() => {}, 1000);
 
const a = fauxSocket("socket-a");
a.envoyer("salon:creer", { pseudo: "Sophiane" });
const code = a.dernier().donnees.code;
console.log("Test 1 - salon:rejoint reçu :", a.dernier().evenement, code);
console.log("Test 2 - moi :", a.dernier().donnees.moi);
console.log("Test 3 - socket dans la room (true) :", a.rooms.includes(code));
 
const b = fauxSocket("socket-b");
b.envoyer("salon:rejoindre", { code: code.toLowerCase(), pseudo: "Sophiane" });
console.log("Test 4 - pseudo en double (Sophiane_2) :", b.dernier().donnees.moi.pseudo);
const liste = envoisSalon[envoisSalon.length - 1];
console.log("Test 5 - participants:liste diffusée (2) :", liste.evenement, liste.donnees.length);
 
const c = fauxSocket("socket-c");
c.envoyer("salon:rejoindre", { code: "ZZZZZZ", pseudo: "Adam" });
console.log("Test 6 - code inconnu :", c.dernier());
c.envoyer("salon:creer", { pseudo: "A" });
console.log("Test 7 - pseudo trop court :", c.dernier());
console.log("Test 8 - pas de salon créé pour rien (1) :", serveur.salons.size);
b.envoyer("salon:rejoindre", { code: code, pseudo: "Bis" });
console.log("Test 9 - rejoindre 2 fois refusé :", b.dernier());
 
b.envoyer("salon:quitter");
const liste2 = envoisSalon[envoisSalon.length - 1];
console.log("Test 10 - liste après départ (1) :", liste2.donnees.length);
console.log("Test 11 - socket sorti de la room (false) :", b.rooms.includes(code));
 
a.envoyer("disconnect");
console.log("Test 12 - salon vide mais encore ouvert (true) :", serveur.trouverSalon(code) !== null);
setTimeout(() => {
  console.log("Test 13 - salon fermé après le délai (null) :", serveur.trouverSalon(code));
}, 1500);
 
const d = fauxSocket("socket-d");
d.envoyer("salon:creer", { pseudo: "Racha" });
const code2 = d.dernier().donnees.code;
d.envoyer("disconnect");
setTimeout(() => {
  const e = fauxSocket("socket-e");
  e.envoyer("salon:rejoindre", { code: code2, pseudo: "Kamelia" });
}, 500);
setTimeout(() => {
  console.log("Test 14 - salon gardé si quelqu'un revient (true) :", serveur.trouverSalon(code2) !== null);
}, 1500);
 