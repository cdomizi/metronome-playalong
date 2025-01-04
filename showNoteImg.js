/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
const noteImgElement = document.querySelector("img#note");
export function showNoteImg(url) {
    // Display the SVG image
    noteImgElement.setAttribute("src", url);
}
