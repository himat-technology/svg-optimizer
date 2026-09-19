export { optimizeSvg, DEFAULT_OPTIMIZATION_OPTIONS } from "./optimizer";
export type {
  OptimizationOptions,
  SvgOptimizationResult,
  SvgOptimizationOutcome,
  SvgPrecision,
  SvgOptimizationError,
} from "./types";
export { parseSvg, isValidSvgMarkup, SvgParseError } from "./parser";
export {
  stripComments,
  removeMetadata,
  removeEmptyGroups,
  cleanUnusedAttributes,
  sanitizeForPreview,
  collectReferencedIds,
} from "./cleaners";
export {
  applyPrecision,
  roundNumberString,
  roundPathData,
} from "./precision";
export {
  getByteSize,
  countElementNodes,
  countNodesFromSvgString,
  calculateBandwidthSavedPercent,
  formatBytes,
} from "./statistics";
export { svgToDataUri } from "./data-uri";
export { serializeSvg, minifySvgXml } from "./serializer";
export { SAMPLE_SVG, SAMPLE_FILENAME } from "./sample";
export {
  createSafePreviewDataUri,
  createSafePreviewSrcDoc,
} from "./preview";
