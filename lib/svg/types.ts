export type SvgPrecision = 1 | 2 | 3;

export interface OptimizationOptions {
  stripComments: boolean;
  removeMetadata: boolean;
  removeEmptyGroups: boolean;
  cleanUnusedAttrs: boolean;
  minifyXml: boolean;
  precision: SvgPrecision;
}

export const DEFAULT_OPTIMIZATION_OPTIONS: OptimizationOptions = {
  stripComments: true,
  removeMetadata: true,
  removeEmptyGroups: true,
  cleanUnusedAttrs: true,
  minifyXml: true,
  precision: 2,
};

export interface SvgOptimizationResult {
  originalSvg: string;
  optimizedSvg: string;
  originalBytes: number;
  optimizedBytes: number;
  bandwidthSavedPercent: number;
  originalNodeCount: number;
  optimizedNodeCount: number;
  nodesCleaned: number;
  dataUri: string;
}

export interface SvgOptimizationError {
  message: string;
  code:
    | "EMPTY"
    | "INVALID_SVG"
    | "PARSE_ERROR"
    | "SERIALIZE_ERROR"
    | "UNKNOWN";
}

export type SvgOptimizationOutcome =
  | { ok: true; result: SvgOptimizationResult }
  | { ok: false; error: SvgOptimizationError };
