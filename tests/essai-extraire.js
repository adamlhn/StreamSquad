const extraireIdVideo = require("../serveur/logique/extraireIdVideo");

const urlsTests = [
  "https://www.youtube.com/watch?v=M7lc1UVf-VE",
  "https://youtube.com/watch?v=M7lc1UVf-VE&t=42s",
  "https://youtu.be/M7lc1UVf-VE?t=10",
  "https://vimeo.com/123",
  "bonjour",
  "https://www.youtube.com/watch?v=abc",
];

for (const u of urlsTests) {
  console.log(`${u} =>`, extraireIdVideo(u));
}
