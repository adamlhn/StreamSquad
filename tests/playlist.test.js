const test = require("node:test");
const assert = require("node:assert");
const Playlist = require("../serveur/logique/Playlist");

test("une playlist neuve est vide", () => {
  const p = new Playlist();
  assert.strictEqual(p.estVide(), true);
  assert.strictEqual(p.suivante(), null);
});

test("ajouter un lien valide renvoie l'identifiant", () => {
  const p = new Playlist();
  const id = p.ajouter("https://www.youtube.com/watch?v=M7lc1UVf-VE");
  assert.strictEqual(id, "M7lc1UVf-VE");
  assert.strictEqual(p.estVide(), false);
});

test("un lien invalide est refusé et n'est pas ajouté", () => {
  const p = new Playlist();
  assert.strictEqual(p.ajouter("https://vimeo.com/123"), null);
  assert.strictEqual(p.estVide(), true);
});

test("les vidéos passent dans l'ordre d'ajout", () => {
  const p = new Playlist();
  p.ajouter("https://youtu.be/M7lc1UVf-VE");
  p.ajouter("https://youtu.be/dQw4w9WgXcQ");
  assert.strictEqual(p.suivante(), "M7lc1UVf-VE");
  assert.strictEqual(p.suivante(), "dQw4w9WgXcQ");
  assert.strictEqual(p.suivante(), null);
});