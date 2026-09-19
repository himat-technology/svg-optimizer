"use client";

import { useCallback, useMemo, useState } from "react";
import {
  DEFAULT_OPTIMIZATION_OPTIONS,
  getByteSize,
  optimizeSvg,
  SAMPLE_FILENAME,
  SAMPLE_SVG,
  type OptimizationOptions,
  type SvgOptimizationResult,
  type SvgPrecision,
} from "@/lib/svg";

export interface UseSvgOptimizerState {
  source: string;
  filename: string | null;
  options: OptimizationOptions;
  result: SvgOptimizationResult | null;
  error: string | null;
  isOptimizing: boolean;
  originalBytes: number;
}

export function useSvgOptimizer() {
  const [source, setSource] = useState("");
  const [filename, setFilename] = useState<string | null>(null);
  const [options, setOptions] = useState<OptimizationOptions>({
    ...DEFAULT_OPTIMIZATION_OPTIONS,
  });
  const [result, setResult] = useState<SvgOptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const originalBytes = useMemo(
    () => (source ? getByteSize(source) : 0),
    [source],
  );

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  const updateSource = useCallback(
    (next: string, nextFilename: string | null = filename) => {
      setSource(next);
      setFilename(nextFilename);
      setResult(null);
      setError(null);
    },
    [filename],
  );

  const clear = useCallback(() => {
    setSource("");
    setFilename(null);
    setResult(null);
    setError(null);
  }, []);

  const loadSample = useCallback(() => {
    setSource(SAMPLE_SVG);
    setFilename(SAMPLE_FILENAME);
    setResult(null);
    setError(null);
  }, []);

  const setOption = useCallback(
    <K extends keyof OptimizationOptions>(
      key: K,
      value: OptimizationOptions[K],
    ) => {
      setOptions((prev) => ({ ...prev, [key]: value }));
      // Invalidate previous result when settings change so user re-runs
      setResult(null);
    },
    [],
  );

  const setPrecision = useCallback((precision: SvgPrecision) => {
    setOptions((prev) => ({ ...prev, precision }));
    setResult(null);
  }, []);

  const optimize = useCallback(() => {
    setIsOptimizing(true);
    setError(null);

    // Yield to the browser so the UI can show a busy state on large files
    window.setTimeout(() => {
      try {
        const outcome = optimizeSvg(source, options);
        if (!outcome.ok) {
          setResult(null);
          setError(outcome.error.message);
        } else {
          setResult(outcome.result);
          setError(null);
        }
      } catch {
        setResult(null);
        setError("Please provide a valid SVG file or SVG markup.");
      } finally {
        setIsOptimizing(false);
      }
    }, 0);
  }, [source, options]);

  const downloadFilename = useMemo(() => {
    if (filename) {
      const base = filename.replace(/\.svg$/i, "");
      return `${base}-optimized.svg`;
    }
    return "optimized-himat.svg";
  }, [filename]);

  return {
    source,
    filename,
    options,
    result,
    error,
    isOptimizing,
    originalBytes,
    downloadFilename,
    updateSource,
    clear,
    loadSample,
    setOption,
    setPrecision,
    optimize,
    clearResult,
  };
}

export type SvgOptimizerApi = ReturnType<typeof useSvgOptimizer>;
