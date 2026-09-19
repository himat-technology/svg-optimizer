import { describe, expect, it } from "vitest";
import {
  optimizeSvg,
  roundNumberString,
  roundPathData,
  getByteSize,
  svgToDataUri,
  SAMPLE_SVG,
  stripComments,
  removeMetadata,
  removeEmptyGroups,
  parseSvg,
  serializeSvg,
} from "@/lib/svg";

describe("SVG optimizer engine", () => {
  it("removes comments when stripComments is enabled", () => {
    const input = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><!-- hello --><circle cx="5" cy="5" r="4"/></svg>`;
    const outcome = optimizeSvg(input, {
      stripComments: true,
      removeMetadata: false,
      removeEmptyGroups: false,
      cleanUnusedAttrs: false,
      minifyXml: true,
      precision: 2,
    });

    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.result.optimizedSvg).not.toContain("<!--");
    expect(outcome.result.optimizedSvg).not.toContain("hello");
    expect(outcome.result.optimizedSvg).toContain("<circle");
  });

  it("removes editor metadata and namespaces", () => {
    const input = `<?xml version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
     xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
     xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
     viewBox="0 0 100 100"
     inkscape:version="1.2"
     sodipodi:docname="x.svg">
  <metadata><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description>meta</rdf:Description></rdf:RDF></metadata>
  <sodipodi:namedview pagecolor="#fff"/>
  <circle cx="50" cy="50" r="40" inkscape:label="c"/>
</svg>`;

    const outcome = optimizeSvg(input, {
      stripComments: true,
      removeMetadata: true,
      removeEmptyGroups: false,
      cleanUnusedAttrs: false,
      minifyXml: true,
      precision: 2,
    });

    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    const out = outcome.result.optimizedSvg;
    expect(out).not.toContain("inkscape:");
    expect(out).not.toContain("sodipodi:");
    expect(out).not.toContain("<metadata");
    expect(out).not.toContain("namedview");
    expect(out).toContain('viewBox="0 0 100 100"');
    expect(out).toContain("<circle");
  });

  it("removes empty groups", () => {
    const input = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><g></g><circle cx="1" cy="1" r="1"/><g><g></g></g></svg>`;
    const outcome = optimizeSvg(input, {
      stripComments: false,
      removeMetadata: false,
      removeEmptyGroups: true,
      cleanUnusedAttrs: false,
      minifyXml: true,
      precision: 2,
    });

    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.result.optimizedSvg).not.toMatch(/<g\s*>\s*<\/g>/);
    expect(outcome.result.optimizedSvg).not.toContain("<g");
    expect(outcome.result.optimizedSvg).toContain("<circle");
  });

  it("rounds coordinates to precision 2", () => {
    expect(roundNumberString("250.123456", 2)).toBe("250.12");
    expect(roundNumberString("120.987654", 2)).toBe("120.99");

    const path = roundPathData("M 250.123456,120.987654 L 10.1 20.999", 2);
    expect(path).toContain("250.12");
    expect(path).toContain("120.99");

    const input = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><circle cx="250.123456" cy="250.000000" r="200.123456"/></svg>`;
    const outcome = optimizeSvg(input, {
      stripComments: false,
      removeMetadata: false,
      removeEmptyGroups: false,
      cleanUnusedAttrs: false,
      minifyXml: true,
      precision: 2,
    });

    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.result.optimizedSvg).toContain('cx="250.12"');
    expect(outcome.result.optimizedSvg).toContain('r="200.12"');
  });

  it("calculates accurate byte sizes with Blob", () => {
    const input = SAMPLE_SVG;
    const outcome = optimizeSvg(input);
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;

    expect(outcome.result.originalBytes).toBe(getByteSize(input));
    expect(outcome.result.optimizedBytes).toBe(
      getByteSize(outcome.result.optimizedSvg),
    );
    expect(outcome.result.optimizedBytes).toBeLessThan(
      outcome.result.originalBytes,
    );
    expect(outcome.result.bandwidthSavedPercent).toBeGreaterThan(0);
    expect(outcome.result.originalNodeCount).toBeGreaterThan(
      outcome.result.optimizedNodeCount,
    );
  });

  it("generates a Base64 data URI", () => {
    const input = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10"/></svg>`;
    const outcome = optimizeSvg(input);
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;

    expect(outcome.result.dataUri.startsWith("data:image/svg+xml;base64,")).toBe(
      true,
    );
    expect(svgToDataUri(outcome.result.optimizedSvg)).toBe(
      outcome.result.dataUri,
    );
  });

  it("returns a clear error for invalid SVG", () => {
    const outcome = optimizeSvg("<not-svg>broken</not-svg>");
    expect(outcome.ok).toBe(false);
    if (outcome.ok) return;
    expect(outcome.error.message).toMatch(/valid SVG/i);
  });

  it("returns a clear error for empty input", () => {
    const outcome = optimizeSvg("   ");
    expect(outcome.ok).toBe(false);
    if (outcome.ok) return;
    expect(outcome.error.code).toBe("EMPTY");
  });

  it("preserves valid SVG structure after optimization", () => {
    const outcome = optimizeSvg(SAMPLE_SVG);
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;

    const reparsed = parseSvg(outcome.result.optimizedSvg);
    expect(reparsed.svgElement.localName.toLowerCase()).toBe("svg");
    expect(reparsed.svgElement.getAttribute("viewBox")).toBeTruthy();
    // Referenced gradient id must remain
    expect(outcome.result.optimizedSvg).toContain('id="himatGrad"');
    expect(outcome.result.optimizedSvg).toContain("url(#himatGrad)");
  });

  it("preserves referenced IDs used by gradients", () => {
    const input = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
      <defs><linearGradient id="g1"><stop offset="0" stop-color="red"/></linearGradient></defs>
      <rect width="10" height="10" fill="url(#g1)"/>
    </svg>`;
    const outcome = optimizeSvg(input);
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.result.optimizedSvg).toContain('id="g1"');
    expect(outcome.result.optimizedSvg).toContain("url(#g1)");
  });

  it("cleaner helpers operate on the live document", () => {
    const { document } = parseSvg(
      `<svg xmlns="http://www.w3.org/2000/svg"><!--c--><metadata>m</metadata><g></g><circle cx="1" cy="1" r="1"/></svg>`,
    );
    stripComments(document);
    removeMetadata(document);
    removeEmptyGroups(document);
    const out = serializeSvg(document, true);
    expect(out).not.toContain("<!--");
    expect(out).not.toContain("metadata");
    expect(out).not.toContain("<g");
  });
});
