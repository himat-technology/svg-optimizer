"use client";

import { useState } from "react";
import type { SvgOptimizationResult } from "@/lib/svg";
import { SvgCodeViewer } from "./SvgCodeViewer";
import { DataUriViewer } from "./DataUriViewer";
import { DownloadButton } from "./DownloadButton";

type ExportTab = "code" | "datauri";

interface ExportPanelProps {
  result: SvgOptimizationResult | null;
  downloadFilename: string;
}

export function ExportPanel({ result, downloadFilename }: ExportPanelProps) {
  const [tab, setTab] = useState<ExportTab>("code");

  const tabs: { id: ExportTab; label: string }[] = [
    { id: "code", label: "Optimized Code" },
    { id: "datauri", label: "Data URI" },
  ];

  return (
    <section
      className="himat-panel p-4 sm:p-5"
      aria-labelledby="export-heading"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2
            id="export-heading"
            className="text-base font-semibold text-slate-900"
          >
            Export
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Copy optimized markup, copy a Base64 Data URI, or download the file.
          </p>
        </div>
        <DownloadButton
          svg={result?.optimizedSvg ?? ""}
          filename={downloadFilename}
          disabled={!result}
        />
      </div>

      <div
        className="mt-4 flex flex-wrap gap-1 border-b border-slate-200"
        role="tablist"
        aria-label="Export formats"
      >
        {tabs.map((t) => {
          const selected = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`export-tab-${t.id}`}
              aria-selected={selected}
              aria-controls={`export-panel-${t.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setTab(t.id)}
              className={`-mb-px border-b-2 px-3 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${
                selected
                  ? "border-teal-600 text-teal-800"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <div
          role="tabpanel"
          id="export-panel-code"
          aria-labelledby="export-tab-code"
          hidden={tab !== "code"}
        >
          {tab === "code" ? (
            <SvgCodeViewer code={result?.optimizedSvg ?? ""} />
          ) : null}
        </div>
        <div
          role="tabpanel"
          id="export-panel-datauri"
          aria-labelledby="export-tab-datauri"
          hidden={tab !== "datauri"}
        >
          {tab === "datauri" ? (
            <DataUriViewer dataUri={result?.dataUri ?? ""} />
          ) : null}
        </div>
      </div>
    </section>
  );
}
