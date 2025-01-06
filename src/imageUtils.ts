// List of available notes
const notesList = [
  "e2",
  "f2",
  "g2",
  "a2",
  "b2",
  "c3",
  "d3",
  "e3",
  "f3",
  "g3",
  "a3",
  "b3",
  "c4",
];

// Get SVG file path for random note
export function getRandomSvgPath() {
  const randomIndex = Math.floor(Math.random() * notesList.length);
  const randomNote = notesList[randomIndex];

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const randomSvgPath = `./static/images/${randomNote}.svg`;

  return randomSvgPath;
}

// eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
const noteImgElement = document.querySelector("img#note") as HTMLImageElement;

// Display SVG image from file path
export function showNoteImg(imgFilePath: string) {
  noteImgElement.setAttribute("src", imgFilePath);
}
