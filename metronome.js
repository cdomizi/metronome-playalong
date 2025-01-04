import { changeNote } from "./changeNote.js";
/* eslint-disable @typescript-eslint/no-floating-promises */
export async function startMetronome(interval, beatsPerMeasure) {
    // Load the audio files
    const highSound = await loadAudio("../public/static/audio/metronome-high.mp3");
    const lowSound = await loadAudio("../public/static/audio/metronome-low.mp3");
    let beatCount = 0;
    // Function to play the sound
    function playBeat() {
        if (beatCount % beatsPerMeasure === 0) {
            // Play high sound on the first beat
            highSound.currentTime = 0; // Reset to start
            highSound.play();
            // Change the note on the first beat
            changeNote();
        }
        else {
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
// Load audio file
function loadAudio(url) {
    return new Promise((resolve, reject) => {
        const audio = new Audio(url);
        audio.addEventListener("canplaythrough", () => {
            resolve(audio);
        }, false);
        audio.addEventListener("error", () => {
            reject(new Error("Failed to load audio: " + url));
        }, false);
        audio.load(); // Start loading the audio
    });
}
