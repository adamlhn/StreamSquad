const test = require("node:test");
const assert = require("node:assert");
const extraireIdVideo = require("../serveur/logique/extraireIdVideo");

test("lien youtube.com/watch : renvoie l'identifiant", () => {
  assert.strictEqual(extraireIdVideo("https://www.youtube.com/watch?v=M7lc1UVf-VE"), "M7lc1UVf-VE");
});

test("lien youtube.com sans www avec &t= : renvoie l'identifiant", () => {
  assert.strictEqual(
    extraireIdVideo("https://youtube.com/watch?v=M7lc1UVf-VE&t=42s"),
    "M7lc1UVf-VE",
  );
});

test("lien youtu.be avec ?t= : renvoie l'identifiant", () => {
  assert.strictEqual(extraireIdVideo("https://youtu.be/M7lc1UVf-VE?t=10"), "M7lc1UVf-VE");
});

test("lien vimeo : renvoie null", () => {
  assert.strictEqual(extraireIdVideo("https://vimeo.com/123"), null);
});

test("texte bonjour (pas un lien): renvoie null", () => {
  assert.strictEqual(extraireIdVideo("bonjour"), null);
});

test("lien youtube.com avec identifiant trop court (<11)", () => {
  assert.strictEqual(extraireIdVideo("https://www.youtube.com/watch?v=abc"), null);
});
