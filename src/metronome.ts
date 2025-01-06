/* eslint-disable @typescript-eslint/no-floating-promises */
import { changeNote, loadAudio } from "./metronomeUtils.js";

export async function startMetronome(
  interval: number,
  beatsPerMeasure: number,
) {
  // Load the audio files
  const highSound = await loadAudio("./static/audio/metronome-high.mp3");
  const lowSound = await loadAudio("./static/audio/metronome-low.mp3");

  let beatCount = 0;

  // Function to play the sound
  function playBeat() {
    if (beatCount % beatsPerMeasure === 0) {
      // Play high sound on the first beat
      highSound.currentTime = 0; // Reset to start
      highSound.play();
      // Change the note on the first beat
      changeNote();
    } else {
      // Play low sound on the following beats
      lowSound.currentTime = 0; // Reset to start
      lowSound.play();
    }

    beatCount++;
    if (beatCount >= beatsPerMeasure) {
      beatCount = 0; // Reset beat count after one measure
    }
  }

  return setInterval(playBeat, interval);
}
