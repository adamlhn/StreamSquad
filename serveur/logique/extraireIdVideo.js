function extraireIdVideo(texte) {
  let url;
  try {
    url = new URL(texte);
  } catch (err) {
    return null;
  }

  let id = null;
  if (url.hostname === "www.youtube.com" || url.hostname === "youtube.com") {
    if (url.pathname === "/watch") {
      id = url.searchParams.get("v");
    }
  } else if (url.hostname === "youtu.be") {
    id = url.pathname.slice(1);
  }

  if (id === null || id.length !== 11) {
    return null;
  }
  return id;
}
module.exports = extraireIdVideo;
