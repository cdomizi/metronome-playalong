import { showNoteImg } from "./imageUtils.js";
import { startMetronome } from "./metronome.js";
import { bpmToMs } from "./metronomeUtils.js";
// UI elements
import {
  beatsPerMeasureValueElement,
  bpmValueElement,
  metronomeButton,
  metronomePauseButton,
  metronomePlayButton,
  staffContainerElement,
  tempoButtonDownElement,
  tempoButtonUpElement,
  tempoSliderElement,
  timeSignatureButtonDownElement,
  timeSignatureButtonUpElement,
  toggleButtonDown,
  toggleButtonUp,
} from "./uiUtils.js";

// Initially show empty staff in UI
const epmtyStaffFilePath = "./static/images/empty-staff.svg";
showNoteImg(epmtyStaffFilePath);

/* ======================== Tempo Section ======================== */

// Set Tempo config & defaults
const TEMPO_CONFIG = {
  defaultTempo: 90,
  minBpm: 1,
  maxBpm: 360,
};

let bpm = TEMPO_CONFIG.defaultTempo; // Set default BPM value
let interval = bpmToMs(bpm); // Convert BPM to ms

tempoSliderElement.value = bpm.toString(); // Set default BPM value on slider
bpmValueElement.textContent = tempoSliderElement.value; // Show default BPM value in UI

function updateTempoSliderValue(newTempoValue: string) {
  tempoSliderElement.value = newTempoValue; // Update slider value
  bpmValueElement.textContent = tempoSliderElement.value; // Update BPM value in UI

  bpm = parseInt(newTempoValue); // Update BPM value
  interval = bpmToMs(bpm); // Update ms value

  // Notify metronome that the tempo has changed
  const tempoChangeEvent = new Event("tempoChange");
  // Only dispatch the event if the metronome is playing
  if (isMetronomePlaying) metronomeButton.dispatchEvent(tempoChangeEvent);
}

function handleTempoSliderChange(event: Event) {
  const newTempoValue = (event.target as HTMLInputElement).value;

  updateTempoSliderValue(newTempoValue);
}

// Change BPM based on slider
tempoSliderElement.addEventListener("change", handleTempoSliderChange);

// Change the value in the slider on button press
toggleButtonUp(TEMPO_CONFIG.maxBpm, bpm, tempoButtonUpElement);
toggleButtonDown(TEMPO_CONFIG.minBpm, bpm, tempoButtonDownElement);

// Increment or decrement beats per measure via button
function handleTempoButtonChange(event: Event) {
  const isIncrement =
    (event.target as HTMLButtonElement).id === "tempo-button-up" ||
    (event.target as HTMLButtonElement).id === "tempo-button-up-icon";

  // Enable/disable buttons based on current value + change
  toggleButtonUp(TEMPO_CONFIG.maxBpm, bpm, tempoButtonUpElement, isIncrement);
  toggleButtonDown(
    TEMPO_CONFIG.minBpm,
    bpm,
    tempoButtonDownElement,
    !isIncrement,
  );

  // Update the value in the slider by dispatching change event
  const tempoSliderEventType = isIncrement ? "increment" : "decrement";
  const tempoChangeEvent = new Event(tempoSliderEventType);
  tempoSliderElement.dispatchEvent(tempoChangeEvent);
}

// Adjust BPM via UI
tempoButtonUpElement.addEventListener("click", handleTempoButtonChange);
tempoButtonDownElement.addEventListener("click", handleTempoButtonChange);

function handleTempoSliderButtonChange(event: Event) {
  event.stopPropagation();

  const isIncrement = event.type === "increment";

  // Calculate new value from current value
  const currentTempoValue = parseInt(tempoSliderElement.value);
  // Increment/decrement current value based on button press +/-
  const newTempoValue = isIncrement
    ? currentTempoValue + 1
    : currentTempoValue - 1;

  updateTempoSliderValue(newTempoValue.toString());
}

// Change slider on button click
tempoSliderElement.addEventListener("increment", handleTempoSliderButtonChange);
tempoSliderElement.addEventListener("decrement", handleTempoSliderButtonChange);

/* ======================== Time Signature Section ======================== */
// Set Time Signature config & defaults
const TIME_SIGNATURE_CONFIG = {
  defaultBeatsPerMeasure: 4,
  minBeatsPerMeasure: 1,
  maxBeatsPerMeasure: 4,
};

// Set default value for beatsPerMeasure
let beatsPerMeasure = TIME_SIGNATURE_CONFIG.defaultBeatsPerMeasure;
// Show default value for beatsPerMeasure in UI
beatsPerMeasureValueElement.textContent = beatsPerMeasure.toString();

// Disable/enable buttons based on config + current values
toggleButtonUp(
  TIME_SIGNATURE_CONFIG.maxBeatsPerMeasure,
  beatsPerMeasure,
  timeSignatureButtonUpElement,
);
toggleButtonDown(
  TIME_SIGNATURE_CONFIG.minBeatsPerMeasure,
  beatsPerMeasure,
  timeSignatureButtonDownElement,
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
    timeSignatureButtonUpElement,
    isIncrement,
  );
  toggleButtonDown(
    TIME_SIGNATURE_CONFIG.minBeatsPerMeasure,
    beatsPerMeasure,
    timeSignatureButtonDownElement,
    !isIncrement,
  );

  // Set the new value
  beatsPerMeasure = isIncrement ? ++beatsPerMeasure : --beatsPerMeasure;

  // Update value in UI
  beatsPerMeasureValueElement.textContent = beatsPerMeasure.toString();

  // Notify metronome that the time signature has changed
  const timeSignatureChangeEvent = new Event("timeSignatureChange");
  // Only dispatch the event if the metronome is playing
  if (isMetronomePlaying)
    metronomeButton.dispatchEvent(timeSignatureChangeEvent);
}

// Adjust BPM via UI
timeSignatureButtonUpElement.addEventListener(
  "click",
  handleTimeSignatureButtonChange,
);
timeSignatureButtonDownElement.addEventListener(
  "click",
  handleTimeSignatureButtonChange,
);

/* ======================== Metronome Section ======================== */
let isMetronomePlaying: number | null;

async function handleMetronomeButtonClick() {
  if (isMetronomePlaying) {
    // Metronome playing
    clearInterval(isMetronomePlaying);
    isMetronomePlaying = null;
    // Change button icon from ⏸️ to ▶️
    metronomePlayButton.setAttribute("class", "");
    metronomePauseButton.setAttribute("class", "hidden");
  } else {
    //Metronome not playing
    isMetronomePlaying = await startMetronome(interval, beatsPerMeasure);
    // Change button icon from ▶️ to ⏸️
    metronomePlayButton.setAttribute("class", "hidden");
    metronomePauseButton.setAttribute("class", "");

    // Scroll to staff
    staffContainerElement.scrollIntoView();
  }
}

// Start/stop metronome on button click
metronomeButton.addEventListener("click", handleMetronomeButtonClick);

async function restartMetronome() {
  if (isMetronomePlaying) {
    // Stop the metronome
    clearInterval(isMetronomePlaying);
    isMetronomePlaying = null;

    // Restart the metronome with the updated value for beatsPerMeasure
    isMetronomePlaying = await startMetronome(interval, beatsPerMeasure);
  }
}

// Restart the metronome on tempo change
metronomeButton.addEventListener("tempoChange", restartMetronome);
// Restart the metronome on time signature change
metronomeButton.addEventListener("timeSignatureChange", restartMetronome);
