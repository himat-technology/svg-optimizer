/**
 * Build a Base64 Data URI from SVG markup.
 */

export function svgToDataUri(svg: string): string {
  const base64 = encodeSvgToBase64(svg);
  return `data:image/svg+xml;base64,${base64}`;
}

function encodeSvgToBase64(svg: string): string {
  if (typeof btoa === "function") {
    // Handle Unicode safely
    const bytes = new TextEncoder().encode(svg);
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }

  // Node.js fallback
  return Buffer.from(svg, "utf-8").toString("base64");
}
