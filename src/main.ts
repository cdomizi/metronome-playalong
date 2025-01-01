/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
import { startMetronome } from "./metronome.js";
import { showNoteImg } from "./showNoteImg.js";

// Start with empty staff
const epmtyStaffURL = "./static/images/empty-staff.svg";
await showNoteImg(epmtyStaffURL);

// Toggle button utils
function toggleDisableButton(disabled: boolean, button: HTMLButtonElement) {
  button.disabled = disabled;
}
function toggleButtonUp(
  maxValue: number,
  currentValue: number,
  button: HTMLButtonElement,
  isIncrement?: boolean,
) {
  const disabled = (isIncrement ?? true) && currentValue >= maxValue - 1;
  toggleDisableButton(disabled, button);
}
function toggleButtonDown(
  minValue: number,
  currentValue: number,
  button: HTMLButtonElement,
  isDecrement?: boolean,
) {
  const disabled = (isDecrement ?? true) && currentValue <= minValue + 1;
  toggleDisableButton(disabled, button);
}

/* ======== Tempo ======== */
const TEMPO_CONFIG = {
  defaultTempo: 90,
  minBpm: 1,
  maxBpm: 360,
};
let bpm = TEMPO_CONFIG.defaultTempo;
const bpmValue = document.querySelector("#tempo-value") as HTMLSpanElement;

// Convert BPM to ms
function bpmToMs(bpm: number) {
  return (60 * 1000) / bpm;
}
let ms = bpmToMs(bpm);

const tempoSlider = document.querySelector("#tempo-slider") as HTMLInputElement;

tempoSlider.value = bpm.toString(); // Set default value
bpmValue.textContent = tempoSlider.value; // Show default value in UI

function handleTempoSliderChange(event: Event) {
  const newTempoValue = (event.target as HTMLInputElement).value;

  bpm = parseInt(newTempoValue); // Update BPM value
  ms = bpmToMs(bpm); // Update ms value
  bpmValue.textContent = tempoSlider.value; // Update BPM value in UI

  // Notify metronome that the tempo has changed
  const tempoChangeEvent = new Event("tempoChange");
  // Only dispatch the event if the metronome is playing
  if (isMetronomePlaying) metronomeToggleButton.dispatchEvent(tempoChangeEvent);
}

// Change BPM based on slider
tempoSlider.addEventListener("change", handleTempoSliderChange);

/* ======== Time Signature ======== */
const TIME_SIGNATURE_CONFIG = {
  defaultBeatsPerMeasure: 4,
  minBeatsPerMeasure: 1,
  maxBeatsPerMeasure: 4,
};
let beatsPerMeasure = TIME_SIGNATURE_CONFIG.defaultBeatsPerMeasure;
const beatsPerMeasureValue = document.querySelector(
  "#time-signature-value",
) as HTMLSpanElement;
beatsPerMeasureValue.textContent = beatsPerMeasure.toString();

const timeSignatureButtonUp = document.querySelector(
  "#time-signature-button-up",
) as HTMLButtonElement;
const timeSignatureButtonDown = document.querySelector(
  "#time-signature-button-down",
) as HTMLButtonElement;

// Disable/enable buttons based on config + current values
toggleButtonUp(
  TIME_SIGNATURE_CONFIG.maxBeatsPerMeasure,
  beatsPerMeasure,
  timeSignatureButtonUp,
);
toggleButtonDown(
  TIME_SIGNATURE_CONFIG.minBeatsPerMeasure,
  beatsPerMeasure,
  timeSignatureButtonDown,
);

// Increment or decrement beats per measure via button
function handleTimeSignatureButtonChange(event: Event) {
  event.stopPropagation();

  const isIncrement =
    (event.target as HTMLButtonElement).id === "time-signature-button-up";

  // Enable/disable buttons based on current value + change
  toggleButtonUp(
    TIME_SIGNATURE_CONFIG.maxBeatsPerMeasure,
    beatsPerMeasure,
    timeSignatureButtonUp,
    isIncrement,
  );
  toggleButtonDown(
    TIME_SIGNATURE_CONFIG.minBeatsPerMeasure,
    beatsPerMeasure,
    timeSignatureButtonDown,
    !isIncrement,
  );

  // Set the new value
  beatsPerMeasure = isIncrement ? ++beatsPerMeasure : --beatsPerMeasure;

  // Update value in UI
  beatsPerMeasureValue.textContent = beatsPerMeasure.toString();

  // Notify metronome that the time signature has changed
  const timeSignatureChangeEvent = new Event("timeSignatureChange");
  // Only dispatch the event if the metronome is playing
  if (isMetronomePlaying)
    metronomeToggleButton.dispatchEvent(timeSignatureChangeEvent);
}

// Adjust BPM via UI
timeSignatureButtonUp.addEventListener(
  "click",
  handleTimeSignatureButtonChange,
);
timeSignatureButtonDown.addEventListener(
  "click",
  handleTimeSignatureButtonChange,
);

/* ======== Metronome ======== */
let isMetronomePlaying: number | null;

const metronomeToggleButton = document.querySelector(
  "#metronome-toggle-button",
) as HTMLButtonElement;

// Start/stop metronome on button click
metronomeToggleButton.addEventListener("click", async () => {
  const metronomePlayButton = document.querySelector(
    "#metronome-button-play-icon",
  ) as SVGElement;
  const metronomePauseButton = document.querySelector(
    "#metronome-button-pause-icon",
  ) as SVGElement;

  if (isMetronomePlaying) {
    // Metronome playing
    clearInterval(isMetronomePlaying);
    isMetronomePlaying = null;
    // Change button icon from ⏸️ to ▶️
    metronomePlayButton.setAttribute("class", "");
    metronomePauseButton.setAttribute("class", "hidden");
  } else {
    //Metronome not playing
    isMetronomePlaying = await startMetronome(ms, beatsPerMeasure);
    // Change button icon from ▶️ to ⏸️
    metronomePlayButton.setAttribute("class", "hidden");
    metronomePauseButton.setAttribute("class", "");
  }
});

async function restartMetronome() {
  if (isMetronomePlaying) {
    // Stop the metronome
    clearInterval(isMetronomePlaying);
    isMetronomePlaying = null;

    // Restart the metronome with the updated value for beatsPerMeasure
    isMetronomePlaying = await startMetronome(ms, beatsPerMeasure);
  }
}

// Restart the metronome on tempo change
metronomeToggleButton.addEventListener("tempoChange", restartMetronome);
// Restart the metronome on time signature change
metronomeToggleButton.addEventListener("timeSignatureChange", restartMetronome);
