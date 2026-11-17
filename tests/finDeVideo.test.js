const test = require("node:test");
const assert = require("node:assert");
const Lecture = require("../serveur/logique/Lecture");
const Playlist = require("../serveur/logique/Playlist");
const gererFinDeVideo = require("../serveur/logique/finDeVideo");

function preparer() {
  const lecture = new Lecture();
  const playlist = new Playlist();
  lecture.charger("M7lc1UVf-VE");
  lecture.play(0);
  return { lecture, playlist };
}

test("à la fin, la vidéo suivante démarre", () => {
  const { lecture, playlist } = preparer();
  playlist.ajouter("https://youtu.be/dQw4w9WgXcQ");
  const r = gererFinDeVideo(lecture, playlist, "M7lc1UVf-VE");
  assert.deepStrictEqual(r, { action: "suivante", idVideo: "dQw4w9WgXcQ" });
  assert.strictEqual(lecture.idVideo, "dQw4w9WgXcQ");
  assert.strictEqual(lecture.enLecture, true);
  assert.strictEqual(playlist.estVide(), true);
});

test("playlist vide : la lecture s'arrête", () => {
  const { lecture, playlist } = preparer();
  const r = gererFinDeVideo(lecture, playlist, "M7lc1UVf-VE");
  assert.strictEqual(r.action, "arret");
  assert.strictEqual(lecture.idVideo, null);
  assert.strictEqual(lecture.enLecture, false);
});

test("une deuxième fin pour la même vidéo est ignorée", () => {
  const { lecture, playlist } = preparer();
  playlist.ajouter("https://youtu.be/dQw4w9WgXcQ");
  playlist.ajouter("https://youtu.be/9bZkp7q19f0");
  gererFinDeVideo(lecture, playlist, "M7lc1UVf-VE");
  const r = gererFinDeVideo(lecture, playlist, "M7lc1UVf-VE");
  assert.strictEqual(r.action, "ignoree");
  assert.strictEqual(lecture.idVideo, "dQw4w9WgXcQ");
  assert.deepStrictEqual(playlist.liste(), ["9bZkp7q19f0"]);
});