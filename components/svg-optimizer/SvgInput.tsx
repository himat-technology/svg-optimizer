"use client";

import { useCallback, useId, useState } from "react";
import { formatBytes } from "@/lib/svg";
import { UploadSvg } from "./UploadSvg";

interface SvgInputProps {
  value: string;
  originalBytes: number;
  onChange: (value: string) => void;
  onUpload: (content: string, filename: string) => void;
  onLoadSample: () => void;
  onClear: () => void;
  onError: (message: string) => void;
  disabled?: boolean;
}

export function SvgInput({
  value,
  originalBytes,
  onChange,
  onUpload,
  onLoadSample,
  onClear,
  onError,
  disabled,
}: SvgInputProps) {
  const [dragging, setDragging] = useState(false);
  const textareaId = useId();

  const handleDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragging(false);
      const file = event.dataTransfer.files?.[0];
      if (!file) {
        return;
      }
      if (
        !file.name.toLowerCase().endsWith(".svg") &&
        file.type !== "image/svg+xml"
      ) {
        onError("Unsupported file type. Please upload a .svg file.");
        return;
      }
      try {
        const text = await file.text();
        onUpload(text, file.name);
      } catch {
        onError("Unable to read the dropped file. Please try again.");
      }
    },
    [onUpload, onError],
  );

  return (
    <section
      className="himat-panel p-4 sm:p-5"
      aria-labelledby="svg-input-heading"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="svg-input-heading"
            className="text-base font-semibold text-slate-900"
          >
            Raw SVG Input
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Paste markup, upload a file, or load the sample. Processing stays in
            your browser.
          </p>
        </div>
        {originalBytes > 0 ? (
          <p
            className="rounded-full bg-blue-100 px-2.5 py-1 font-mono text-xs font-semibold text-blue-800"
            aria-live="polite"
          >
            {formatBytes(originalBytes)}
          </p>
        ) : null}
      </div>

      <div
        className={`mt-4 rounded-xl border-2 border-dashed p-1 transition ${
          dragging
            ? "border-teal-500 bg-gradient-to-br from-teal-50 to-cyan-50"
            : "border-blue-100 bg-gradient-to-br from-slate-50 to-blue-50/40"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <label htmlFor={textareaId} className="sr-only">
          SVG source code
        </label>
        <textarea
          id={textareaId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          spellCheck={false}
          placeholder="Paste your SVG markup here…"
          className="min-h-[220px] w-full resize-y rounded-lg border border-transparent bg-white/90 px-3 py-3 font-mono text-xs leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 disabled:opacity-60 sm:min-h-[280px] sm:text-[13px]"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <UploadSvg onLoad={onUpload} onError={onError} disabled={disabled} />
        <button
          type="button"
          onClick={onLoadSample}
          disabled={disabled}
          className="inline-flex items-center justify-center rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-sm font-semibold text-amber-900 shadow-sm transition hover:bg-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Load Sample SVG
        </button>
        <button
          type="button"
          onClick={onClear}
          disabled={disabled || !value}
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear
        </button>
      </div>
    </section>
  );
}
