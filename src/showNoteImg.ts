/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
const noteImgElement = document.querySelector("img#note") as HTMLImageElement;

export function showNoteImg(url: string) {
  // Display the SVG image
  noteImgElement.setAttribute("src", url);
}
