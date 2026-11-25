// Classe PageSalon : affichage de la page du salon (lot C)
// - code du salon et lien à partager
// - lecteur vidéo (classe Lecteur du lot A)
// - liste des participants, chat, playlist
class PageSalon {
  constructor(connexion) {
    this.connexion = connexion;
    this.moi = null; // { id, pseudo } envoyé par le serveur dans salon:rejoint
    this.code = null;
    this.lecteur = null;
    this.etatEnAttente = null; // état vidéo reçu avant que le lecteur soit prêt
    this.anciensParticipants = null; // pour savoir qui arrive et qui part (F15)

    // éléments de la page
    this.page = document.getElementById("page-salon");
    this.codeAffiche = document.getElementById("code-affiche");
    this.listeParticipants = document.getElementById("liste-participants");
    this.nombreParticipants = document.getElementById("nombre-participants");
    this.listeMessages = document.getElementById("liste-messages");
    this.listePlaylist = document.getElementById("liste-playlist");
    this.nombrePlaylist = document.getElementById("nombre-playlist");
    this.playlistVide = document.getElementById("playlist-vide");
    this.aucuneVideo = document.getElementById("aucune-video");
    this.boutonRejoindreLecture = document.getElementById("bouton-rejoindre-lecture");

    this.brancherFormulaires();
    this.ecouterServeur();
  }

  // ---------- Ouvrir / fermer le salon ----------

  // appelé quand le serveur envoie salon:rejoint (état complet du salon)
  ouvrir(etat) {
    this.code = etat.code;
    this.moi = etat.moi;

    this.codeAffiche.textContent = etat.code;
    this.page.hidden = false;
    document.title = "StreamSquad - Salon " + etat.code;
    // met le code dans l'adresse : la page peut être partagée telle quelle
    history.replaceState(null, "", "?code=" + etat.code);

    this.anciensParticipants = null;
    this.afficherParticipants(etat.participants);
    this.listeMessages.innerHTML = "";
    for (const message of etat.messages) {
      this.afficherMessage(message);
    }
    this.afficherPlaylist(etat.playlist);
    this.appliquerEtatVideo(etat.lecture);
  }

  fermer() {
    this.connexion.quitterSalon();
    this.code = null;
    this.moi = null;
    this.page.hidden = true;
    document.title = "StreamSquad";
    history.replaceState(null, "", "/");
    if (this.lecteurEstPret()) {
      this.lecteur.player.stopVideo();
      this.lecteur.idVideo = null;
      this.lecteur.lectureDemandee = false;
    }
  }

  // ---------- Formulaires et boutons ----------

  brancherFormulaires() {
    // chat
    document.getElementById("form-chat").addEventListener("submit", (event) => {
      event.preventDefault();
      const champ = document.getElementById("texte-message");
      const texte = champ.value.trim();
      if (texte.length < 1 || texte.length > 500) {
        return;
      }
      this.connexion.envoyerMessage(texte);
      champ.value = "";
    });

    // "Lire" : change la vidéo en cours
    document.getElementById("form-video").addEventListener("submit", (event) => {
      event.preventDefault();
      const url = this.lireLienVideo();
      if (url !== null) {
        this.connexion.chargerVideo(url);
      }
    });

    // "+ Playlist" : ajoute à la fin de la file
    document.getElementById("bouton-ajouter").addEventListener("click", () => {
      const url = this.lireLienVideo();
      if (url !== null) {
        this.connexion.ajouterALaPlaylist(url);
        notifier("Vidéo ajoutée à la playlist");
      }
    });

    // copier le lien du salon
    document.getElementById("bouton-copier").addEventListener("click", () => {
      const lien = location.origin + "/?code=" + this.code;
      navigator.clipboard
        .writeText(lien)
        .then(() => notifier("Lien copié : " + lien))
        .catch(() => notifier("Lien du salon : " + lien));
    });

    // lecture bloquée par le navigateur (F2)
    this.boutonRejoindreLecture.addEventListener("click", () => {
      this.lecteur.rejoindre();
      this.boutonRejoindreLecture.hidden = true;
    });
  }

  // lit le champ du lien et vérifie le format (RG11). Renvoie null si le lien est faux.
  lireLienVideo() {
    const champ = document.getElementById("lien-video");
    const url = champ.value.trim();
    const format = /^https?:\/\/(www\.)?(youtube\.com\/watch\?.*v=|youtu\.be\/)[\w-]{11}/;
    if (!format.test(url)) {
      // l'erreur n'est affichée qu'à celui qui a collé le lien (F2)
      notifier("Lien invalide : utilisez un lien youtube.com/watch ou youtu.be", true);
      return null;
    }
    champ.value = "";
    return url;
  }

  // ---------- Messages reçus du serveur ----------

  ecouterServeur() {
    this.connexion.ecouter("participants:liste", (liste) => this.afficherParticipants(liste));
    this.connexion.ecouter("chat:message", (message) => this.afficherMessage(message));
    this.connexion.ecouter("playlist:liste", (liste) => this.afficherPlaylist(liste));
    this.connexion.ecouter("video:etat", (etat) => this.appliquerEtatVideo(etat));
  }

  // ---------- Participants (F5) ----------

  afficherParticipants(liste) {
    this.annoncerArriveesEtDeparts(liste);
    this.listeParticipants.innerHTML = "";
    for (const participant of liste) {
      const li = document.createElement("li");

      const avatar = document.createElement("span");
      avatar.className = "avatar";
      avatar.textContent = participant.pseudo.charAt(0).toUpperCase();
      avatar.style.backgroundColor = couleurDuPseudo(participant.pseudo);

      const nom = document.createElement("span");
      nom.textContent = participant.pseudo;

      li.append(avatar, nom);
      if (this.moi !== null && participant.id === this.moi.id) {
        const toi = document.createElement("span");
        toi.className = "badge-toi";
        toi.textContent = "toi";
        li.append(toi);
      }
      this.listeParticipants.append(li);
    }
    this.nombreParticipants.textContent = liste.length;
  }

  // ---------- Notifications dans le chat (F15) ----------

  // compare l'ancienne liste et la nouvelle pour trouver qui arrive et qui part
  annoncerArriveesEtDeparts(liste) {
    if (this.anciensParticipants !== null) {
      // nouveaux : dans la nouvelle liste mais pas dans l'ancienne
      for (const participant of liste) {
        const etaitLa = this.anciensParticipants.some((p) => p.id === participant.id);
        if (!etaitLa) {
          this.afficherNotification(participant.pseudo + " a rejoint le salon");
        }
      }
      // partis : dans l'ancienne liste mais plus dans la nouvelle
      for (const participant of this.anciensParticipants) {
        const estEncoreLa = liste.some((p) => p.id === participant.id);
        if (!estEncoreLa) {
          this.afficherNotification(participant.pseudo + " a quitté le salon");
        }
      }
    }
    this.anciensParticipants = liste;
  }

  // ajoute une ligne grise dans le chat
  afficherNotification(texte) {
    const li = document.createElement("li");
    li.className = "message-systeme";
    li.textContent = texte;
    this.listeMessages.append(li);
    this.listeMessages.scrollTop = this.listeMessages.scrollHeight;
  }
  
  // ---------- Chat (F3) ----------

  afficherMessage(message) {
    // le rapport de conception dit "pseudoAuteur", la classe Message dit "pseudo" : on accepte les deux
    const pseudo = message.pseudoAuteur || message.pseudo;

    const li = document.createElement("li");
    li.className = "message";
    if (this.moi !== null && pseudo === this.moi.pseudo) {
      li.classList.add("message-moi");
    }

    const entete = document.createElement("div");
    entete.className = "message-entete";

    const auteur = document.createElement("span");
    auteur.className = "message-auteur";
    auteur.textContent = pseudo;
    auteur.style.color = couleurDuPseudo(pseudo);

    const heure = document.createElement("span");
    heure.className = "message-heure";
    heure.textContent = formaterHeure(message.envoyeLe);

    const texte = document.createElement("p");
    // textContent (et pas innerHTML) : un message ne peut pas exécuter de code (F3)
    texte.textContent = message.texte;

    entete.append(auteur, heure);
    li.append(entete, texte);
    this.listeMessages.append(li);

    // descend tout en bas pour voir le dernier message
    this.listeMessages.scrollTop = this.listeMessages.scrollHeight;
  }

  // ---------- Playlist (F7) ----------

  afficherPlaylist(liste) {
    this.listePlaylist.innerHTML = "";
    liste.forEach((video, index) => {
      // la classe Playlist envoie des identifiants ; on accepte aussi un objet { idVideo }
      const idVideo = typeof video === "string" ? video : video.idVideo;

      const li = document.createElement("li");

      const miniature = document.createElement("img");
      miniature.src = "https://i.ytimg.com/vi/" + idVideo + "/mqdefault.jpg";
      miniature.alt = "";

      const texte = document.createElement("span");
      texte.textContent = index + 1 + ". youtu.be/" + idVideo;

      li.append(miniature, texte);
      this.listePlaylist.append(li);
    });
    this.nombrePlaylist.textContent = liste.length;
    this.playlistVide.hidden = liste.length > 0;
  }

  // ---------- Vidéo (F2, F6) ----------

  // appelé par onYouTubeIframeAPIReady (voir accueil.js)
  creerLecteur() {
    this.lecteur = new Lecteur(
      "lecteur",
      (evenement, donnees) => this.connexion.envoyer(evenement, donnees),
      () => {
        this.boutonRejoindreLecture.hidden = false;
      },
    );
  }

  lecteurEstPret() {
    // le player YouTube n'a ses fonctions qu'une fois chargé
    return this.lecteur !== null && typeof this.lecteur.player.getPlayerState === "function";
  }

  appliquerEtatVideo(etat) {
    if (this.code === null) {
      return;
    }
    this.aucuneVideo.hidden = etat.idVideo !== null;

    if (!this.lecteurEstPret()) {
      // on garde l'état et on réessaie un peu plus tard
      this.etatEnAttente = etat;
      setTimeout(() => {
        if (this.etatEnAttente === etat) {
          this.etatEnAttente = null;
          this.appliquerEtatVideo(etat);
        }
      }, 300);
      return;
    }

    if (etat.idVideo === null) {
      // plus de vidéo (playlist terminée)
      if (this.lecteur.idVideo !== null) {
        this.lecteur.player.stopVideo();
        this.lecteur.idVideo = null;
        this.lecteur.lectureDemandee = false;
      }
      return;
    }
    this.lecteur.appliquerEtat(etat);
  }
}

// ---------- Petites fonctions utiles ----------

// affiche un petit message en bas de l'écran pendant 3 s
function notifier(texte, estErreur = false) {
  const zone = document.getElementById("notification");
  zone.textContent = texte;
  zone.classList.toggle("notification-erreur", estErreur);
  zone.hidden = false;
  clearTimeout(notifier.minuteur);
  notifier.minuteur = setTimeout(() => {
    zone.hidden = true;
  }, 3000);
}

// "14:05" à partir d'une date en millisecondes
function formaterHeure(millisecondes) {
  const date = new Date(millisecondes);
  return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

// une couleur toujours la même pour un même pseudo
function couleurDuPseudo(pseudo) {
  let total = 0;
  for (const lettre of pseudo) {
    total = total + lettre.charCodeAt(0);
  }
  const teinte = (total * 47) % 360;
  return "hsl(" + teinte + ", 65%, 60%)";
}
