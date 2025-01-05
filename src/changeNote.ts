import { getRandomSvgPath } from "./getImgPaths.js";
import { showNoteImg } from "./showNoteImg.js";

// eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
const staffContainer = document.querySelector(
  "#staff-container",
) as HTMLElement;

export function changeNote() {
  // Get path of random SVG file
  const randomSvg = getRandomSvgPath();

  // Handle error on getting SVG file path
  if (!randomSvg) {
    console.error(`Error: Could not get SVG file.`);
    staffContainer.textContent =
      "An error occurred: Cannot display a new note.";

    return;
  }

  showNoteImg(randomSvg);
}
