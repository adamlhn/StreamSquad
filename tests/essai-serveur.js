const Serveur = require("../serveur/logique/Serveur");
 
const envois = [];
function envoyer(code, etat) {
  envois.push({ code: code, etat: etat });
}
 
const serveur = new Serveur(envoyer, 1000);
 
let codeCorrect = true;
for (let i = 0; i < 1000; i++) {
  const code = serveur.genererCode();
  if (code.length !== 6 || /[O0I1]/.test(code)) {
    codeCorrect = false;
  }
}
console.log("Test 1 - 1000 codes de 6 caractères sans O0I1 (true) :", codeCorrect);
 
const s1 = serveur.creerSalon();
const s2 = serveur.creerSalon();
console.log("Test 2 - deux salons, codes différents (true) :", s1.code !== s2.code);
console.log("Test 3 - deux salons enregistrés (2) :", serveur.salons.size);
 
console.log("Test 4 - salon retrouvé (true) :", serveur.trouverSalon(s1.code) === s1);
console.log("Test 5 - salon retrouvé en minuscules (true) :", serveur.trouverSalon(s1.code.toLowerCase()) === s1);
console.log("Test 6 - salon retrouvé avec espaces (true) :", serveur.trouverSalon("  " + s1.code + "  ") === s1);
console.log("Test 7 - code inconnu (null) :", serveur.trouverSalon("ZZZZZZ"));
 
serveur.fermerSalon(s2.code);
console.log("Test 8 - salon fermé (null) :", serveur.trouverSalon(s2.code));
 
s1.ajouterParticipant("socket-1", "Sophiane");
const vide = serveur.creerSalon();
serveur.diffuserEtat();
console.log("Test 9 - un seul envoi (1) :", envois.length);
console.log("Test 10 - envoi pour le bon salon (true) :", envois[0].code === s1.code);
console.log("Test 11 - état de la vidéo envoyé :", envois[0].etat);
 
serveur.fermerSalon(vide.code);
 
s1.retirerParticipant("socket-1");
serveur.planifierFermeture(s1.code);
setTimeout(() => {
  console.log("Test 12 - salon fermé après le délai (null) :", serveur.trouverSalon(s1.code));
}, 1500);
 
const s3 = serveur.creerSalon();
serveur.planifierFermeture(s3.code);
setTimeout(() => {
  s3.ajouterParticipant("socket-2", "Adam");
  serveur.annulerFermeture(s3.code);
}, 500);
setTimeout(() => {
  console.log("Test 13 - salon gardé si quelqu'un revient (true) :", serveur.trouverSalon(s3.code) === s3);
}, 1500);
 
const s4 = serveur.creerSalon();
serveur.planifierFermeture(s4.code);
s4.ajouterParticipant("socket-3", "Racha");
setTimeout(() => {
  console.log("Test 14 - salon pas vide jamais fermé (true) :", serveur.trouverSalon(s4.code) === s4);
}, 1500);
 
const s5 = serveur.creerSalon();
serveur.planifierFermeture(s5.code);
serveur.fermerSalon(s5.code);
console.log("Test 15 - minuteur supprimé avec le salon (false) :", serveur.minuteurs.has(s5.code));
 
const serveur2 = new Serveur(envoyer);
console.log("Test 16 - délai par défaut 5 min (300000) :", serveur2.delaiFermeture);
 
const envoisSynchro = [];
const serveur3 = new Serveur((code) => envoisSynchro.push(code), 1000);
const s6 = serveur3.creerSalon();
s6.ajouterParticipant("socket-4", "Kamelia");
serveur3.demarrerSynchro();
serveur3.demarrerSynchro();
setTimeout(() => {
  serveur3.arreterSynchro();
  console.log("Test 17 - synchro toutes les 2 s, 2 envois en 5 s (2) :", envoisSynchro.length);
  console.log("Test 18 - synchro arrêtée (null) :", serveur3.synchro);
}, 5000);
 
// const s7 = serveur.creerSalon();
// console.log("Test 19 - salon créé avec une playlist (true) :", s7.playlist !== null);
// s7.playlist.ajouter("https://www.youtube.com/watch?v=M7lc1UVf-VE");
// console.log("Test 20 - playlist dans l'état complet (['M7lc1UVf-VE']) :", s7.etatComplet().playlist);
// serveur.fermerSalon(s7.code);
 