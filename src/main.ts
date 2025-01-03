/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
import { startMetronome } from "./metronome.js";
import { showNoteImg } from "./showNoteImg.js";

// Start with empty staff
const epmtyStaffURL = "./static/images/empty-staff.svg";
showNoteImg(epmtyStaffURL);

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

function updateTempoSliderValue(newTempoValue: string) {
  tempoSlider.value = newTempoValue; // Update slider value
  bpmValue.textContent = tempoSlider.value; // Update BPM value in UI

  bpm = parseInt(newTempoValue); // Update BPM value
  ms = bpmToMs(bpm); // Update ms value

  // Notify metronome that the tempo has changed
  const tempoChangeEvent = new Event("tempoChange");
  // Only dispatch the event if the metronome is playing
  if (isMetronomePlaying) metronomeToggleButton.dispatchEvent(tempoChangeEvent);
}

function handleTempoSliderChange(event: Event) {
  const newTempoValue = (event.target as HTMLInputElement).value;

  updateTempoSliderValue(newTempoValue);
}

// Change BPM based on slider
tempoSlider.addEventListener("change", handleTempoSliderChange);

const tempoButtonUp = document.querySelector(
  "#tempo-button-up",
) as HTMLButtonElement;
const tempoButtonDown = document.querySelector(
  "#tempo-button-down",
) as HTMLButtonElement;

// Change the value in the slider on button press
toggleButtonUp(TEMPO_CONFIG.maxBpm, bpm, tempoButtonUp);
toggleButtonDown(TEMPO_CONFIG.minBpm, bpm, tempoButtonDown);

// Increment or decrement beats per measure via button
function handleTempoButtonChange(event: Event) {
  const isIncrement =
    (event.target as HTMLButtonElement).id === "tempo-button-up" ||
    (event.target as HTMLButtonElement).id === "tempo-button-up-icon";

  // Enable/disable buttons based on current value + change
  toggleButtonUp(TEMPO_CONFIG.maxBpm, bpm, tempoButtonUp, isIncrement);
  toggleButtonDown(TEMPO_CONFIG.minBpm, bpm, tempoButtonDown, !isIncrement);

  // Update the value in the slider by dispatching change event
  const tempoSliderEventType = isIncrement ? "increment" : "decrement";
  const tempoChangeEvent = new Event(tempoSliderEventType);
  tempoSlider.dispatchEvent(tempoChangeEvent);
}

// Adjust BPM via UI
tempoButtonUp.addEventListener("click", handleTempoButtonChange);
tempoButtonDown.addEventListener("click", handleTempoButtonChange);

function handleTempoSliderButtonChange(event: Event) {
  event.stopPropagation();

  const isIncrement = event.type === "increment";

  // Calculate new value from current value
  const currentTempoValue = parseInt(tempoSlider.value);
  // Increment/decrement current value based on button press +/-
  const newTempoValue = isIncrement
    ? currentTempoValue + 1
    : currentTempoValue - 1;

  updateTempoSliderValue(newTempoValue.toString());
}

// Change slider on button click
tempoSlider.addEventListener("increment", handleTempoSliderButtonChange);
tempoSlider.addEventListener("decrement", handleTempoSliderButtonChange);

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

const staffContainer = document.querySelector(
  "staff-container",
) as HTMLDivElement;

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

    // Scroll to staff
    staffContainer.scrollIntoView();
  }
});

async function restartMetronome() {
  if (isMetronomePlaying) {
    // Stop the metronome
    clearInterval(isMetronomePlaying);
    isMetronomePlaying = null;

    // Restart the metronome with the updated value for beatsPerMeasure
    isMetronomePlaying = await startMetronome(ms, beatsPerMeasure);

    // Scroll to staff
    staffContainer.scrollIntoView();
  }
}

// Restart the metronome on tempo change
metronomeToggleButton.addEventListener("tempoChange", restartMetronome);
// Restart the metronome on time signature change
metronomeToggleButton.addEventListener("timeSignatureChange", restartMetronome);
