async function getImgPaths() {
    // Get content from the `images folder`
    const response = await fetch("./public/static/images");
    const body = await response.text();
    // Parse content as HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(body, "text/html");
    // SVG files are displayed as anchor elements
    const links = doc.querySelectorAll("a");
    if (!links.length) {
        throw Error("Document does not contain SVG element");
    }
    // Filter out non-SVG files and empty staff
    const svgPaths = Array.from(links)
        .map((link) => link.href)
        .filter((link) => link.endsWith(".svg") && !link.toLowerCase().includes("staff"));
    return svgPaths;
}
export async function getRandomSvgPath() {
    const svgPaths = await getImgPaths();
    const randomIndex = Math.floor(Math.random() * svgPaths.length);
    return svgPaths[randomIndex];
}
