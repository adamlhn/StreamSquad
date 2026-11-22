const Message = require("../serveur/logique/Message");

// Test 1 : message normal, les espaces autour sont enlevés
const m = new Message("Sophiane", "  Salut tout le monde  ");
console.log("Test 1 - texte nettoyé :", m.versObjet());

// Test 2 : message vide (que des espaces) -> refusé
try {
  new Message("Sophiane", "    ");
  console.log("Test 2 - ERREUR : le message vide a été accepté");
} catch (e) {
  console.log("Test 2 - refusé comme prévu :", e.message);
}

// Test 3 : message de 501 caractères -> refusé
try {
  new Message("Sophiane", "a".repeat(501));
  console.log("Test 3 - ERREUR : le message trop long a été accepté");
} catch (e) {
  console.log("Test 3 - refusé comme prévu :", e.message);
}

// Test 4 : message de 500 caractères pile -> accepté
const m4 = new Message("Sophiane", "a".repeat(500));
console.log("Test 4 - 500 caractères acceptés :", m4.texte.length);
