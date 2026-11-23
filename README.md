# StreamSquad

Plateforme de visionnage de vidéo en groupe - Projet IL

Lot A : synchronisation vidéo

- `serveur/logique/Lecture.js` : classe `Lecture`, l'état de référence de la vidéo d'un salon (vidéo en cours, position, lecture ou pause). Méthodes `play`, `pause`, `seek`, `charger`, `positionActuelle` et `etat` (contenu du message `video:etat`).
- `serveur/logique/extraireIdVideo.js` : vérifie un lien YouTube (`youtube.com/watch?v=...` ou `youtu.be/...`) et renvoie l'identifiant de la vidéo, ou `null`.
- `serveur/sockets/video.js` : fonction `brancherVideo(io, socket, serveur)`, appelée dans `serveur/index.js`. Reçoit `video:play`, `video:pause`, `video:seek` et `video:charger`, met à jour la `Lecture` du salon et envoie `video:etat` à tout le salon. Un lien invalide renvoie un message `erreur` à celui qui l'a envoyé.
- `public/js/Lecteur.js` : classe `Lecteur`, pilote le lecteur YouTube du navigateur. Applique l'état reçu du serveur (`appliquerEtat`), se recale si l'écart dépasse 1,5 s, envoie `video:play`, `video:pause` et `video:seek` quand l'utilisateur agit, sans renvoyer les ordres reçus, et `video:fin` quand la vidéo se termine. Si le navigateur bloque la lecture automatique, la page affiche un bouton « Rejoindre la lecture » (`rejoindre()` remet le son et lance la vidéo).

_Ce fichier a été écrit à l'aide d'un LLM en suivant l'avancée personnelle du code_
