// Gère la fin d'une vidéo : lance la suivante de la playlist, ou arrête la lecture.
// Une fin reçue pour une vidéo qui n'est plus la vidéo en cours est ignorée.
function gererFinDeVideo(lecture, playlist, idVideoTerminee) {
  if (lecture.idVideo !== idVideoTerminee) {
    return { action: "ignoree" };
  }

  const suivante = playlist.suivante();
  if (suivante === null) {
    lecture.charger(null);
    return { action: "arret" };
  }

  lecture.charger(suivante);
  lecture.play(0);
  return { action: "suivante", idVideo: suivante };
}

module.exports = gererFinDeVideo;