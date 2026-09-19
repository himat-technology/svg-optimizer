import type { SvgPrecision } from "./types";

/**
 * Numeric attributes that are safe to round.
 */
const NUMERIC_ATTRIBUTES = new Set([
  "x",
  "y",
  "cx",
  "cy",
  "r",
  "rx",
  "ry",
  "width",
  "height",
  "x1",
  "x2",
  "y1",
  "y2",
  "dx",
  "dy",
  "fx",
  "fy",
  "opacity",
  "fill-opacity",
  "stroke-opacity",
  "stroke-width",
  "stroke-dashoffset",
  "font-size",
  "letter-spacing",
  "word-spacing",
  "startOffset",
  "pathLength",
  "refX",
  "refY",
  "markerWidth",
  "markerHeight",
  "stdDeviation",
  "baseFrequency",
  "k1",
  "k2",
  "k3",
  "k4",
  "offset",
  "stop-opacity",
]);

const PATH_COMMANDS = /([MmLlHhVvCcSsQqTtAaZz])/g;

/**
 * Round a numeric string to the given precision, stripping trailing zeros
 * after the decimal point while preserving integer appearance when clean.
 */
export function roundNumberString(
  value: string,
  precision: SvgPrecision,
): string {
  const trimmed = value.trim();
  if (!trimmed || !/^-?\d*\.?\d+(?:[eE][+-]?\d+)?$/.test(trimmed)) {
    return value;
  }

  const num = Number(trimmed);
  if (!Number.isFinite(num)) {
    return value;
  }

  const factor = 10 ** precision;
  const rounded = Math.round(num * factor) / factor;

  // Avoid scientific notation for typical SVG coords
  let result = rounded.toFixed(precision);
  // Strip trailing zeros and optional trailing decimal point
  result = result.replace(/(\.\d*?[1-9])0+$/, "$1").replace(/\.0+$/, "");
  if (result.includes(".")) {
    result = result.replace(/0+$/, "").replace(/\.$/, "");
  }

  return result;
}

/**
 * Round all numbers embedded in a path `d` attribute without corrupting commands.
 */
export function roundPathData(d: string, precision: SvgPrecision): string {
  if (!d.trim()) {
    return d;
  }

  // Split keeping command letters
  const tokens = d
    .replace(PATH_COMMANDS, " $1 ")
    .trim()
    .split(/[\s,]+/)
    .filter(Boolean);

  const out: string[] = [];

  for (const token of tokens) {
    if (/^[MmLlHhVvCcSsQqTtAaZz]$/.test(token)) {
      out.push(token);
      continue;
    }

    // Arc flags must remain 0 or 1 — leave single-digit integers alone when
    // they are exactly 0 or 1 following an arc command. Conservatively round
    // all numeric tokens; flags are already short.
    if (/^-?\d*\.?\d+(?:[eE][+-]?\d+)?$/.test(token)) {
      out.push(roundNumberString(token, precision));
    } else {
      out.push(token);
    }
  }

  // Reconstruct with spaces; collapse "M 10 20" style
  return out
    .join(" ")
    .replace(/ ([MmLlHhVvCcSsQqTtAaZz])/g, "$1")
    .replace(/([MmLlHhVvCcSsQqTtAaZz]) /g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Round numbers inside a transform attribute value.
 */
export function roundTransform(
  transform: string,
  precision: SvgPrecision,
): string {
  return transform.replace(
    /-?\d*\.?\d+(?:[eE][+-]?\d+)?/g,
    (match) => roundNumberString(match, precision),
  );
}

/**
 * Round numbers inside a points attribute (polyline/polygon).
 */
export function roundPoints(
  points: string,
  precision: SvgPrecision,
): string {
  return points.replace(
    /-?\d*\.?\d+(?:[eE][+-]?\d+)?/g,
    (match) => roundNumberString(match, precision),
  );
}

/**
 * Apply precision rounding across the SVG document tree.
 */
export function applyPrecision(
  document: Document,
  precision: SvgPrecision,
): void {
  const root = document.documentElement;
  if (!root) {
    return;
  }

  const elements = root.querySelectorAll("*");
  const all = [root, ...Array.from(elements)];

  for (const el of all) {
    // Named attributes
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name;
      const value = attr.value;

      if (name === "d" || name.endsWith(":d")) {
        el.setAttribute(name, roundPathData(value, precision));
        continue;
      }

      if (name === "transform" || name.endsWith(":transform")) {
        el.setAttribute(name, roundTransform(value, precision));
        continue;
      }

      if (name === "points") {
        el.setAttribute(name, roundPoints(value, precision));
        continue;
      }

      if (name === "viewBox" || name === "viewbox") {
        el.setAttribute(
          name,
          value
            .trim()
            .split(/[\s,]+/)
            .map((part) => roundNumberString(part, precision))
            .join(" "),
        );
        continue;
      }

      if (NUMERIC_ATTRIBUTES.has(name) || NUMERIC_ATTRIBUTES.has(localName(name))) {
        // Skip percentage / unit values that aren't plain numbers
        if (/^-?\d*\.?\d+(?:[eE][+-]?\d+)?$/.test(value.trim())) {
          el.setAttribute(name, roundNumberString(value, precision));
        } else if (/^-?\d*\.?\d+(?:[eE][+-]?\d+)?(%|px|em|ex|pt|pc|cm|mm|in)$/i.test(value.trim())) {
          const match = value.trim().match(/^(-?\d*\.?\d+(?:[eE][+-]?\d+)?)(%|[a-z]+)$/i);
          if (match) {
            el.setAttribute(
              name,
              `${roundNumberString(match[1], precision)}${match[2]}`,
            );
          }
        }
        continue;
      }

      // style attribute numeric properties
      if (name === "style" && value.includes(":")) {
        el.setAttribute(name, roundStyleValue(value, precision));
      }
    }
  }
}

function localName(name: string): string {
  const idx = name.indexOf(":");
  return idx >= 0 ? name.slice(idx + 1) : name;
}

function roundStyleValue(style: string, precision: SvgPrecision): string {
  return style.replace(
    /(:\s*)(-?\d*\.?\d+(?:[eE][+-]?\d+)?)(px|em|ex|%|pt|pc|cm|mm|in)?(\s*;?)/gi,
    (_full, colon: string, num: string, unit: string | undefined, end: string) =>
      `${colon}${roundNumberString(num, precision)}${unit || ""}${end}`,
  );
}
