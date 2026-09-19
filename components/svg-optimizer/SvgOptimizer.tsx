"use client";

import { useCallback, useState } from "react";
import { isValidSvgMarkup } from "@/lib/svg";
import { SITE } from "@/lib/site";
import { useSvgOptimizer } from "@/hooks/useSvgOptimizer";
import { PrivacyNotice } from "./PrivacyNotice";
import { SvgInput } from "./SvgInput";
import { OptimizationControls } from "./OptimizationControls";
import { OptimizationStats } from "./OptimizationStats";
import { PreviewComparison } from "./PreviewComparison";
import { ExportPanel } from "./ExportPanel";

export function SvgOptimizer() {
  const optimizer = useSvgOptimizer();
  const [bannerError, setBannerError] = useState<string | null>(null);

  const showError = useCallback((message: string) => {
    setBannerError(message);
  }, []);

  const handleUpload = useCallback(
    (content: string, name: string) => {
      if (!isValidSvgMarkup(content)) {
        showError("Please provide a valid SVG file or SVG markup.");
        return;
      }
      setBannerError(null);
      optimizer.updateSource(content, name);
    },
    [optimizer, showError],
  );

  const handleSourceChange = useCallback(
    (value: string) => {
      setBannerError(null);
      optimizer.updateSource(value, optimizer.filename);
    },
    [optimizer],
  );

  const handleOptimize = useCallback(() => {
    setBannerError(null);
    optimizer.optimize();
  }, [optimizer]);

  const displayError = bannerError || optimizer.error;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <header className="space-y-4">
        <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/70 p-5 shadow-lg shadow-blue-500/5 backdrop-blur sm:p-7">
          <div
            aria-hidden
            className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-teal-400/30 via-blue-400/25 to-fuchsia-400/20 blur-2xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-12 left-10 h-32 w-32 rounded-full bg-amber-300/25 blur-2xl"
          />
          <p className="relative text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
            Free Tools · {SITE.name}
          </p>
          <h1 className="himat-hero-title relative mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            SVG Optimizer &amp; Vector Cleaner
          </h1>
          <p className="relative mt-3 max-w-2xl text-base text-slate-600">
            Compress, clean, sanitize, and minify SVG vector graphics directly in
            your browser. Purge design metadata, round path precision, compare
            renders, and export Base64 Data URIs — with no server upload.
          </p>
          <div className="relative mt-4 flex flex-wrap gap-2 text-xs font-medium">
            <a
              href={SITE.demoSvgOptimizer}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-cyan-100 px-3 py-1 text-cyan-900 ring-1 ring-cyan-200 transition hover:bg-cyan-200"
            >
              Live demo
            </a>
            <a
              href={`tel:${SITE.phoneTel}`}
              className="rounded-full bg-amber-100 px-3 py-1 text-amber-900 ring-1 ring-amber-200 transition hover:bg-amber-200"
            >
              {SITE.phoneDisplay}
            </a>
            <a
              href={SITE.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-blue-100 px-3 py-1 text-blue-900 ring-1 ring-blue-200 transition hover:bg-blue-200"
            >
              LinkedIn
            </a>
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-pink-100 px-3 py-1 text-pink-900 ring-1 ring-pink-200 transition hover:bg-pink-200"
            >
              Instagram
            </a>
            <a
              href={SITE.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-sky-100 px-3 py-1 text-sky-900 ring-1 ring-sky-200 transition hover:bg-sky-200"
            >
              Facebook
            </a>
          </div>
        </div>
        <PrivacyNotice />
      </header>

      {displayError ? (
        <div
          className="rounded-xl border border-rose-200 bg-gradient-to-r from-rose-50 to-orange-50 px-4 py-3 text-sm text-rose-800 shadow-sm"
          role="alert"
          aria-live="assertive"
        >
          {displayError}
        </div>
      ) : null}

      <SvgInput
        value={optimizer.source}
        originalBytes={optimizer.originalBytes}
        onChange={handleSourceChange}
        onUpload={handleUpload}
        onLoadSample={() => {
          setBannerError(null);
          optimizer.loadSample();
        }}
        onClear={() => {
          setBannerError(null);
          optimizer.clear();
        }}
        onError={showError}
        disabled={optimizer.isOptimizing}
      />

      <OptimizationControls
        options={optimizer.options}
        onToggle={optimizer.setOption}
        onPrecisionChange={optimizer.setPrecision}
        onOptimize={handleOptimize}
        isOptimizing={optimizer.isOptimizing}
        canOptimize={optimizer.source.trim().length > 0}
      />

      <OptimizationStats result={optimizer.result} />

      <PreviewComparison
        originalSvg={optimizer.source}
        optimizedSvg={optimizer.result?.optimizedSvg ?? null}
      />

      <ExportPanel
        result={optimizer.result}
        downloadFilename={optimizer.downloadFilename}
      />
    </div>
  );
}
