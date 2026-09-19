import { stripComments, removeMetadata, removeEmptyGroups, cleanUnusedAttributes } from "./cleaners";
import { svgToDataUri } from "./data-uri";
import { parseSvg, SvgParseError } from "./parser";
import { applyPrecision } from "./precision";
import { serializeSvg } from "./serializer";
import {
  calculateBandwidthSavedPercent,
  countElementNodes,
  getByteSize,
} from "./statistics";
import type {
  OptimizationOptions,
  SvgOptimizationOutcome,
  SvgOptimizationResult,
} from "./types";
import { DEFAULT_OPTIMIZATION_OPTIONS } from "./types";

export { DEFAULT_OPTIMIZATION_OPTIONS };
export type { OptimizationOptions, SvgOptimizationResult, SvgOptimizationOutcome };

/**
 * Optimize SVG markup entirely in-memory using DOMParser / XMLSerializer.
 */
export function optimizeSvg(
  originalSvg: string,
  options: Partial<OptimizationOptions> = {},
): SvgOptimizationOutcome {
  const opts: OptimizationOptions = {
    ...DEFAULT_OPTIMIZATION_OPTIONS,
    ...options,
  };

  try {
    const originalBytes = getByteSize(originalSvg);
    const { document } = parseSvg(originalSvg);
    const originalNodeCount = countElementNodes(document);

    if (opts.stripComments) {
      stripComments(document);
    }

    if (opts.removeMetadata) {
      removeMetadata(document);
    }

    // Precision before empty-group cleanup so path/attr changes don't affect structure
    applyPrecision(document, opts.precision);

    if (opts.cleanUnusedAttrs) {
      cleanUnusedAttributes(document);
    }

    if (opts.removeEmptyGroups) {
      removeEmptyGroups(document);
    }

    // Second empty-group pass after attribute cleanup can help, already looped inside

    const optimizedSvg = serializeSvg(document, opts.minifyXml);
    const optimizedBytes = getByteSize(optimizedSvg);
    const optimizedNodeCount = countElementNodes(
      parseSvg(optimizedSvg).document,
    );

    const result: SvgOptimizationResult = {
      originalSvg,
      optimizedSvg,
      originalBytes,
      optimizedBytes,
      bandwidthSavedPercent: calculateBandwidthSavedPercent(
        originalBytes,
        optimizedBytes,
      ),
      originalNodeCount,
      optimizedNodeCount,
      nodesCleaned: Math.max(0, originalNodeCount - optimizedNodeCount),
      dataUri: svgToDataUri(optimizedSvg),
    };

    return { ok: true, result };
  } catch (error) {
    if (error instanceof SvgParseError) {
      return {
        ok: false,
        error: { message: error.message, code: error.code },
      };
    }

    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while optimizing the SVG.";

    return {
      ok: false,
      error: {
        message: message.includes("XMLSerializer")
          ? "Unable to serialize the SVG in this browser."
          : "Please provide a valid SVG file or SVG markup.",
        code: "UNKNOWN",
      },
    };
  }
}
