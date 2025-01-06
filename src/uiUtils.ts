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
