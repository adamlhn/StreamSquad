const test = require("node:test");
const assert = require("node:assert");
const Lecture = require("../serveur/logique/Lecture");

test("play : la position avance avec le temps", () => {
  const l = new Lecture();
  l.play(10);
  l.misAJourLe = Date.now() - 2000;
  assert.ok(Math.abs(l.positionActuelle() - 12) < 0.1);
});

test("Lecture neuve : idVideo null, position 0, enLecture false", () => {
  const l = new Lecture();
  assert.strictEqual(l.idVideo, null);
  assert.strictEqual(l.position, 0);
  assert.strictEqual(l.enLecture, false);
});

test("pause(30) : enLecture false, position ne bouge plus meme apres plusieurs secondes", () => {
  const l = new Lecture();
  l.play(10);
  l.pause(30);
  l.misAJourLe = Date.now() - 2000;
  assert.strictEqual(l.enLecture, false);
  assert.strictEqual(l.positionActuelle(), 30);
});

test("seek(60) pendant la lecture : enLecture reste true, position ≈ 60", () => {
  const l = new Lecture();
  l.play(10);
  l.seek(60);
  assert.strictEqual(l.enLecture, true);
  assert.ok(Math.abs(l.positionActuelle() - 60) < 0.1);
});

test("charger('M7lc1UVf-VE') pendant la lecture : bon idVideo,  position 0, enLecture false", () => {
  const l = new Lecture();
  l.play(50);
  l.charger("M7lc1UVf-VE");
  assert.strictEqual(l.idVideo, "M7lc1UVf-VE");
  assert.strictEqual(l.position, 0);
  assert.strictEqual(l.enLecture, false);
});

test("etat : contient idVideo, position, enLecture et envoyeLe (doit etre un nombre)", () => {
  const l = new Lecture();
  l.charger("M7lc1UVf-VE");
  l.pause(30);
  const e = l.etat();
  assert.strictEqual(e.idVideo, "M7lc1UVf-VE");
  assert.strictEqual(e.position, 30);
  assert.strictEqual(e.enLecture, false);
  assert.strictEqual(typeof e.envoyeLe, "number");
});
