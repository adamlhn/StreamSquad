const test = require("node:test");
const assert = require("node:assert");
const Serveur = require("../serveur/logique/Serveur");
const brancherSalon = require("../serveur/sockets/salon");
const brancherPlaylist = require("../serveur/sockets/playlist");

// Faux io et faux socket : pas de réseau, on note juste ce qui est envoyé
function preparer() {
  const envois = [];
  const io = {
    to(code) {
      return {
        emit(evenement, donnees) {
          envois.push({ code: code, evenement: evenement, donnees: donnees });
        },
      };
    },
  };
  const serveur = new Serveur(() => {}, 1000);

  function fauxSocket(id) {
    const socket = {
      id: id,
      data: {},
      recus: [],
      ecouteurs: {},
      on(evenement, fonction) {
        this.ecouteurs[evenement] = fonction;
      },
      emit(evenement, donnees) {
        this.recus.push({ evenement: evenement, donnees: donnees });
      },
      join() {},
      leave() {},
      envoyer(evenement, donnees) {
        this.ecouteurs[evenement](donnees);
      },
      dernier() {
        return this.recus[this.recus.length - 1];
      },
    };
    brancherSalon(io, socket, serveur);
    brancherPlaylist(io, socket, serveur);
    return socket;
  }
  return { io, envois, serveur, fauxSocket };
}

test("ajouter un lien valide diffuse la playlist à tout le salon", () => {
  const { envois, fauxSocket } = preparer();
  const a = fauxSocket("a");
  a.envoyer("salon:creer", { pseudo: "Kamelia" });
  a.envoyer("playlist:ajouter", { url: "https://youtu.be/M7lc1UVf-VE" });
  const dernier = envois[envois.length - 1];
  assert.strictEqual(dernier.evenement, "playlist:liste");
  assert.deepStrictEqual(dernier.donnees, ["M7lc1UVf-VE"]);
});

test("un lien invalide renvoie une erreur à celui qui l'a envoyé seulement", () => {
  const { envois, fauxSocket } = preparer();
  const a = fauxSocket("a");
  a.envoyer("salon:creer", { pseudo: "Kamelia" });
  const avant = envois.length;
  a.envoyer("playlist:ajouter", { url: "https://vimeo.com/123" });
  assert.strictEqual(a.dernier().evenement, "erreur");
  assert.strictEqual(envois.length, avant);
});

test("ajouter sans être dans un salon renvoie une erreur", () => {
  const { fauxSocket } = preparer();
  const a = fauxSocket("a");
  a.envoyer("playlist:ajouter", { url: "https://youtu.be/M7lc1UVf-VE" });
  assert.strictEqual(a.dernier().evenement, "erreur");
});

test("à la fin d'une vidéo, la suivante démarre pour tout le salon", () => {
  const { envois, serveur, fauxSocket } = preparer();
  const a = fauxSocket("a");
  a.envoyer("salon:creer", { pseudo: "Kamelia" });
  const salon = serveur.trouverSalon(a.data.code);
  salon.lecture.charger("M7lc1UVf-VE");
  salon.lecture.play(0);
  a.envoyer("playlist:ajouter", { url: "https://youtu.be/dQw4w9WgXcQ" });
  a.envoyer("video:fin", { idVideo: "M7lc1UVf-VE" });
  const evenements = envois.map((e) => e.evenement);
  assert.ok(evenements.includes("video:etat"));
  assert.strictEqual(salon.lecture.idVideo, "dQw4w9WgXcQ");
  assert.deepStrictEqual(salon.playlist.liste(), []);
});

test("une deuxième fin pour la même vidéo ne change rien", () => {
  const { envois, serveur, fauxSocket } = preparer();
  const a = fauxSocket("a");
  a.envoyer("salon:creer", { pseudo: "Kamelia" });
  const salon = serveur.trouverSalon(a.data.code);
  salon.lecture.charger("M7lc1UVf-VE");
  salon.lecture.play(0);
  a.envoyer("playlist:ajouter", { url: "https://youtu.be/dQw4w9WgXcQ" });
  a.envoyer("playlist:ajouter", { url: "https://youtu.be/9bZkp7q19f0" });
  a.envoyer("video:fin", { idVideo: "M7lc1UVf-VE" });
  const nbEnvois = envois.length;
  a.envoyer("video:fin", { idVideo: "M7lc1UVf-VE" });
  assert.strictEqual(envois.length, nbEnvois);
  assert.deepStrictEqual(salon.playlist.liste(), ["9bZkp7q19f0"]);
});