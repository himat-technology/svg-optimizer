/**
 * Parse and validate SVG markup using DOMParser.
 */

export interface ParsedSvg {
  document: Document;
  svgElement: SVGSVGElement;
}

export class SvgParseError extends Error {
  readonly code: "EMPTY" | "INVALID_SVG" | "PARSE_ERROR";

  constructor(message: string, code: "EMPTY" | "INVALID_SVG" | "PARSE_ERROR") {
    super(message);
    this.name = "SvgParseError";
    this.code = code;
  }
}

function getParserErrorMessage(doc: Document): string | null {
  const parserError = doc.querySelector("parsererror");
  if (parserError) {
    const text = parserError.textContent?.trim() || "Malformed XML.";
    return text.slice(0, 200);
  }
  return null;
}

function looksLikeSvg(input: string): boolean {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed.includes("<svg")) {
    return false;
  }
  return /<svg[\s>]/i.test(trimmed);
}

/**
 * Parse SVG markup into a Document. Throws SvgParseError on failure.
 */
export function parseSvg(input: string): ParsedSvg {
  const source = input.trim();

  if (!source) {
    throw new SvgParseError(
      "Please provide a valid SVG file or SVG markup.",
      "EMPTY",
    );
  }

  if (!looksLikeSvg(source)) {
    throw new SvgParseError(
      "Please provide a valid SVG file or SVG markup.",
      "INVALID_SVG",
    );
  }

  if (typeof DOMParser === "undefined") {
    throw new SvgParseError(
      "SVG parsing is not available in this environment.",
      "PARSE_ERROR",
    );
  }

  const parser = new DOMParser();
  const document = parser.parseFromString(source, "image/svg+xml");

  const parserError = getParserErrorMessage(document);
  if (parserError) {
    throw new SvgParseError(
      "Invalid SVG markup. Please check that your file is well-formed XML.",
      "PARSE_ERROR",
    );
  }

  const svgElement = document.documentElement;
  if (
    !svgElement ||
    svgElement.localName.toLowerCase() !== "svg" ||
    (svgElement.namespaceURI &&
      svgElement.namespaceURI !== "http://www.w3.org/2000/svg" &&
      svgElement.namespaceURI !== null)
  ) {
    // Some browsers may omit namespace; still require root <svg>
    if (!svgElement || svgElement.localName.toLowerCase() !== "svg") {
      throw new SvgParseError(
        "Please provide a valid SVG file or SVG markup.",
        "INVALID_SVG",
      );
    }
  }

  return {
    document,
    svgElement: svgElement as unknown as SVGSVGElement,
  };
}

/**
 * Soft validation used for uploads before optimizing.
 */
export function isValidSvgMarkup(input: string): boolean {
  try {
    parseSvg(input);
    return true;
  } catch {
    return false;
  }
}
