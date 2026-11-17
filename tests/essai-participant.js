const Participant = require("../serveur/logique/Participant");

// Test 1 : pseudo normal, les espaces autour sont enlevés
const p = new Participant("socket-abc", "  Sophiane  ");
console.log("Test 1 - participant créé :", p.versObjet());

// Test 2 : pseudo d'1 caractère -> refusé
try {
  new Participant("socket-abc", "S");
  console.log("Test 2 - ERREUR : le pseudo trop court a été accepté");
} catch (e) {
  console.log("Test 2 - refusé comme prévu :", e.message);
}

// Test 3 : pseudo de 21 caractères -> refusé
try {
  new Participant("socket-abc", "a".repeat(21));
  console.log("Test 3 - ERREUR : le pseudo trop long a été accepté");
} catch (e) {
  console.log("Test 3 - refusé comme prévu :", e.message);
}

// Test 4 : pseudos limites (2 et 20 caractères) -> acceptés
const p2 = new Participant("socket-1", "Al");
const p20 = new Participant("socket-2", "a".repeat(20));
console.log("Test 4 - 2 et 20 caractères acceptés :", p2.pseudo.length, p20.pseudo.length);
