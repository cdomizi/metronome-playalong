const notes = [
    "e2",
    "f2",
    "g2",
    "a2",
    "b2",
    "c3",
    "d3",
    "e3",
    "f3",
    "g3",
    "a3",
    "b3",
    "c4",
];
export function getRandomSvgPath() {
    const randomIndex = Math.floor(Math.random() * notes.length);
    const randomNote = notes[randomIndex];
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const randomSvgPath = `./static/images/${randomNote}.svg`;
    return randomSvgPath;
}
