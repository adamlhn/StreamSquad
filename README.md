# StreamSquad

Plateforme de visionnage de vidéo en groupe - Projet IL

Lot A : synchronisation vidéo

- `serveur/logique/Lecture.js` : classe `Lecture`, l'état de référence de la vidéo d'un salon (vidéo en cours, position, lecture ou pause). Méthodes `play`, `pause`, `seek`, `charger`, `positionActuelle` et `etat` (contenu du message `video:etat`).
- `serveur/logique/extraireIdVideo.js` : vérifie un lien YouTube (`youtube.com/watch?v=...` ou `youtu.be/...` et renvoie l'identifiant de la vidéo, ou `null`.
- `public/js/lecteur.js` : classe `Lecteur`, pilote le lecteur YouTube du navigateur. Applique l'état reçu du serveur (`appliquerEtat`), se recale si l'écart dépasse 1,5 s, envoie `video:play`, `video:pause` et `video:seek` quand l'utilisateur agit, sans renvoyer les ordres reçus.

_Ce fichier a été écrit à l'aide d'un LLM en suivant l'avancée personelle du code_
