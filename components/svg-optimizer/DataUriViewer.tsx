"use client";

import { useClipboard } from "@/hooks/useClipboard";

interface DataUriViewerProps {
  dataUri: string;
}

export function DataUriViewer({ dataUri }: DataUriViewerProps) {
  const { copy, copied, error } = useClipboard();

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-600">
          Base64 Data URI for CSS{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
            background-image
          </code>{" "}
          or inline{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">&lt;img&gt;</code>{" "}
          usage.
        </p>
        <button
          type="button"
          onClick={() => void copy(dataUri)}
          disabled={!dataUri}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          aria-live="polite"
        >
          {copied ? "Copied!" : "Copy Data URI"}
        </button>
      </div>
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <pre
        className="max-h-[200px] overflow-auto break-all rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-relaxed text-slate-700 whitespace-pre-wrap"
        tabIndex={0}
        aria-label="SVG Base64 data URI"
      >
        <code>
          {dataUri || "data:image/svg+xml;base64,…"}
        </code>
      </pre>
    </div>
  );
}
