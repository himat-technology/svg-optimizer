/**
 * Serialize an SVG Document back to a string.
 */

export function serializeSvg(
  document: Document,
  minify: boolean,
): string {
  if (typeof XMLSerializer === "undefined") {
    throw new Error("XMLSerializer is not available in this environment.");
  }

  const serializer = new XMLSerializer();
  let output = serializer.serializeToString(document);

  // Ensure xmlns is present for standalone SVG files
  if (
    !/\sxmlns=/.test(output) &&
    output.includes("<svg")
  ) {
    output = output.replace(
      /<svg\b/,
      '<svg xmlns="http://www.w3.org/2000/svg"',
    );
  }

  if (minify) {
    output = minifySvgXml(output);
  }

  return output;
}

/**
 * Collapse unnecessary whitespace between tags while preserving text content
 * inside elements that may contain meaningful whitespace (e.g. <text>, <tspan>).
 */
export function minifySvgXml(svg: string): string {
  // Remove XML declaration and DOCTYPE (safe for inline SVG / browsers)
  let result = svg
    .replace(/<\?xml[\s\S]*?\?>/gi, "")
    .replace(/<!DOCTYPE[\s\S]*?>/gi, "")
    .trim();

  // Collapse whitespace between tags
  result = result.replace(/>\s+</g, "><");

  // Collapse runs of spaces/newlines inside attribute-free text gaps
  // but keep single spaces that might be intentional in text nodes —
  // the >\s+< pass already handles inter-element whitespace.
  result = result.replace(/\s{2,}/g, " ");

  return result.trim();
}
