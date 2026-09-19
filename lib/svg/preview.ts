/**
 * Clean up the messy preview helper — keep createSafePreviewSrcDoc simple.
 */
import { parseSvg } from "./parser";
import { sanitizeForPreview } from "./cleaners";
import { serializeSvg } from "./serializer";
import { svgToDataUri } from "./data-uri";

/**
 * Build a sandboxed HTML document embedding sanitized SVG for iframe srcDoc.
 */
export function createSafePreviewSrcDoc(svg: string): string {
  let safeSvg: string;
  try {
    const { document } = parseSvg(svg);
    sanitizeForPreview(document);
    safeSvg = serializeSvg(document, false);
  } catch {
    safeSvg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"></svg>';
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<style>
  html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: transparent; }
  body { display: flex; align-items: center; justify-content: center; }
  svg { max-width: 100%; max-height: 100%; width: auto; height: auto; }
</style>
</head>
<body>${safeSvg}</body>
</html>`;
}

/**
 * Preferred safe preview: data URI for use with &lt;img&gt;.
 * Images cannot execute scripts in SVG in modern browsers when loaded as img.
 */
export function createSafePreviewDataUri(svg: string): string {
  try {
    const { document } = parseSvg(svg);
    sanitizeForPreview(document);
    return svgToDataUri(serializeSvg(document, false));
  } catch {
    return svgToDataUri(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"></svg>',
    );
  }
}
