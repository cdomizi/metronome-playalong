/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
function toggleDisableButton(disabled: boolean, button: HTMLButtonElement) {
  button.disabled = disabled;
}

export function toggleButtonUp(
  maxValue: number,
  currentValue: number,
  button: HTMLButtonElement,
  isIncrement?: boolean,
) {
  const disabled = (isIncrement ?? true) && currentValue >= maxValue - 1;
  toggleDisableButton(disabled, button);
}

export function toggleButtonDown(
  minValue: number,
  currentValue: number,
  button: HTMLButtonElement,
  isDecrement?: boolean,
) {
  const disabled = (isDecrement ?? true) && currentValue <= minValue + 1;
  toggleDisableButton(disabled, button);
}

/* ======================== HTML Elements ======================== */

// TEMPO section
export const bpmValueElement = document.querySelector(
  "#tempo-value",
) as HTMLSpanElement;

export const tempoSliderElement = document.querySelector(
  "#tempo-slider",
) as HTMLInputElement;

export const tempoButtonUpElement = document.querySelector(
  "#tempo-button-up",
) as HTMLButtonElement;

export const tempoButtonDownElement = document.querySelector(
  "#tempo-button-down",
) as HTMLButtonElement;

// TIME SIGNATURE section
export const beatsPerMeasureValueElement = document.querySelector(
  "#time-signature-value",
) as HTMLSpanElement;

export const timeSignatureButtonUpElement = document.querySelector(
  "#time-signature-button-up",
) as HTMLButtonElement;

export const timeSignatureButtonDownElement = document.querySelector(
  "#time-signature-button-down",
) as HTMLButtonElement;

// METRONOME section
export const metronomeButton = document.querySelector(
  "#metronome-toggle-button",
) as HTMLButtonElement;

export const metronomePlayButton = document.querySelector(
  "#metronome-button-play-icon",
) as SVGElement;

export const metronomePauseButton = document.querySelector(
  "#metronome-button-pause-icon",
) as SVGElement;

// STAFF section
export const staffContainerElement = document.querySelector(
  "#staff-container",
) as HTMLDivElement;

export const noteImgElement = document.querySelector(
  "img#note",
) as HTMLImageElement;
