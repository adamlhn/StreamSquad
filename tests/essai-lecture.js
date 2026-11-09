const Lecture = require("../serveur/logique/Lecture");

// Test 1 : play puis pause
const l = new Lecture();
l.play(10);
setTimeout(() => {
  console.log("Test 1 - après 2 s de lecture (≈ 12) :", l.positionActuelle());
  l.pause(l.positionActuelle());
  console.log("Test 1 - après pause :", l.etat());
}, 2000);

// Test 2 : seek pendant la lecture (enLecture doit rester true)
const l3 = new Lecture();
l3.play(0);
l3.seek(60);
setTimeout(() => {
  console.log(
    "Test 2 - seek à 60 puis 1 s (≈ 61, enLecture true) :",
    l3.etat(),
  );
}, 1000);

// Test 3 : charger une nouvelle vidéo pendant la lecture
const l2 = new Lecture();
l2.play(50);
l2.charger("M7lc1UVf-VE");
setTimeout(() => {
  console.log(
    "Test 3 - après charger (position 0, enLecture false) :",
    l2.etat(),
  );
}, 1000);
