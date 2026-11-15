// Petit serveur juste pour tester les pages de public/ (pas le vrai serveur du projet)
const express = require("express");

const app = express();
app.use(express.static("public"));

app.listen(3000, () => {
  console.log("Essai : http://localhost:3000/essai-lecteur.html");
});
