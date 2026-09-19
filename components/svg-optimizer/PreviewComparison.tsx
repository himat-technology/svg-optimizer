"use client";

import { SvgPreview } from "./SvgPreview";

interface PreviewComparisonProps {
  originalSvg: string;
  optimizedSvg: string | null;
}

export function PreviewComparison({
  originalSvg,
  optimizedSvg,
}: PreviewComparisonProps) {
  return (
    <section
      className="himat-panel p-4 sm:p-5"
      aria-labelledby="preview-heading"
    >
      <h2
        id="preview-heading"
        className="text-base font-semibold text-slate-900"
      >
        Visual Preview
      </h2>
      <p className="mt-0.5 text-sm text-slate-500">
        Side-by-side render comparison. Previews load as sandboxed images so
        scripts cannot run.
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl ring-2 ring-slate-200/80">
          <SvgPreview
            svg={originalSvg}
            label="Original Render"
            emptyMessage="Paste or upload an SVG to preview the original."
          />
        </div>
        <div className="rounded-2xl ring-2 ring-teal-300/70">
          <SvgPreview
            svg={optimizedSvg ?? ""}
            label="Optimized Render"
            emptyMessage="Run Optimize SVG to preview the cleaned result."
          />
        </div>
      </div>
    </section>
  );
}
