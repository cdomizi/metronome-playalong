import { getRandomSvgPath, showNoteImg } from "./imageUtils.js";
import { staffContainerElement } from "./uiUtils.js";

export function changeNote() {
  // Get path of random SVG file
  const randomNoteImgPath = getRandomSvgPath();

  // Handle error on getting SVG file path
  if (!randomNoteImgPath) {
    console.error(`Error: Could not get SVG file.`);
    staffContainerElement.textContent =
      "An error occurred: Cannot display a new note.";

    return;
  }

  showNoteImg(randomNoteImgPath);
}

// Load audio file
export function loadAudio(audioFilePath: string): Promise<HTMLAudioElement> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(audioFilePath);

    audio.addEventListener(
      "canplaythrough",
      () => {
        resolve(audio);
      },
      false,
    );
    audio.addEventListener(
      "error",
      () => {
        reject(new Error("Failed to load audio: " + audioFilePath));
      },
      false,
    );

    audio.load(); // Start loading the audio
  });
}

// Convert BPM to milliseconds
export function bpmToMs(bpm: number) {
  return (60 * 1000) / bpm;
}
