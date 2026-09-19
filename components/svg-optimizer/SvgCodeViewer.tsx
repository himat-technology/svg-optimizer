"use client";

import { useClipboard } from "@/hooks/useClipboard";

interface SvgCodeViewerProps {
  code: string;
}

export function SvgCodeViewer({ code }: SvgCodeViewerProps) {
  const { copy, copied, error } = useClipboard();

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-600">
          Optimized SVG source ready to paste into your project.
        </p>
        <button
          type="button"
          onClick={() => void copy(code)}
          disabled={!code}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          aria-live="polite"
        >
          {copied ? "Copied!" : "Copy Code"}
        </button>
      </div>
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <pre
        className="max-h-[360px] overflow-auto rounded-xl border border-slate-200 bg-slate-950 p-4 font-mono text-xs leading-relaxed text-teal-100"
        tabIndex={0}
        aria-label="Optimized SVG code"
      >
        <code>{code || "<!-- Optimize an SVG to see the result here -->"}</code>
      </pre>
    </div>
  );
}
