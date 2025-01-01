// eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
const staffContainer = document.querySelector(
  "#staff-container",
) as HTMLElement;

export async function showNoteImg(url: string) {
  const response = await fetch(url);
  const responseBody = await response.text();

  // Parse the content as HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(responseBody, "text/html");
  const fragment = doc.querySelector("svg");
  if (fragment == null) {
    throw Error("Document does not contain svg element");
  }

  // Delete previous note if exists
  const previousNote = document.querySelector("#note");
  if (previousNote !== null) {
    staffContainer.replaceChildren();
  }

  // Display the SVG image
  fragment.setAttribute("id", "note");
  staffContainer.append(fragment);
}
