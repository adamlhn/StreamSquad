const Salon = require("../serveur/logique/Salon");

const s = new Salon("ABC234");

// Test 1 : ajouter deux participants
s.ajouterParticipant("socket-1", "Sophiane");
s.ajouterParticipant("socket-2", "Adam");
console.log("Test 1 - deux participants :", s.listeParticipants());

// Test 2 : même id deux fois -> refusé
try {
  s.ajouterParticipant("socket-1", "Racha");
  console.log("Test 2 - ERREUR : le même id a été accepté deux fois");
} catch (e) {
  console.log("Test 2 - refusé comme prévu :", e.message);
}

// Test 3 : pseudo déjà pris -> Sophiane_2 puis Sophiane_3
const p3 = s.ajouterParticipant("socket-3", "Sophiane");
const p4 = s.ajouterParticipant("socket-4", "Sophiane");
console.log("Test 3 - pseudos en double (Sophiane_2, Sophiane_3) :", p3.pseudo, p4.pseudo);

// Test 4 : retirer un participant
s.retirerParticipant("socket-4");
console.log("Test 4 - après départ de socket-4 (3 restants) :", s.participants.size);

// Test 5 : envoyer un message
const m = s.ajouterMessage("socket-2", "  Salut !  ");
console.log("Test 5 - message envoyé par Adam :", m.versObjet());

// Test 6 : message d'un id qui n'est pas dans le salon -> refusé
try {
  s.ajouterMessage("socket-inconnu", "coucou");
  console.log("Test 6 - ERREUR : un inconnu a pu écrire");
} catch (e) {
  console.log("Test 6 - refusé comme prévu :", e.message);
}

// Test 7 : on ne garde que les 50 derniers messages
for (let i = 1; i <= 60; i++) {
  s.ajouterMessage("socket-1", "message " + i);
}
console.log(
  "Test 7 - 50 messages gardés, du 'message 11' au 'message 60' :",
  s.messages.length,
  s.messages[0].texte,
  s.messages[49].texte,
);

// Test 8 : salon vide quand tout le monde est parti
s.retirerParticipant("socket-1");
s.retirerParticipant("socket-2");
s.retirerParticipant("socket-3");
console.log("Test 8 - salon vide (true) :", s.estVide());

// Test 9 : état complet envoyé à un nouvel arrivant
s.ajouterParticipant("socket-5", "Kamelia");
const etat = s.etatComplet();
console.log(
  "Test 9 - état complet :",
  etat.code,
  etat.participants,
  etat.messages.length + " messages",
  etat.lecture,
  etat.playlist,
);
