"use client";

import { useId } from "react";
import type { OptimizationOptions, SvgPrecision } from "@/lib/svg";

interface OptimizationControlsProps {
  options: OptimizationOptions;
  onToggle: <K extends keyof OptimizationOptions>(
    key: K,
    value: OptimizationOptions[K],
  ) => void;
  onPrecisionChange: (precision: SvgPrecision) => void;
  onOptimize: () => void;
  isOptimizing: boolean;
  canOptimize: boolean;
}

interface ToggleDef {
  key: keyof Omit<OptimizationOptions, "precision">;
  label: string;
  description: string;
}

const TOGGLES: ToggleDef[] = [
  {
    key: "stripComments",
    label: "Strip Comments",
    description: "Remove XML and HTML comments",
  },
  {
    key: "removeMetadata",
    label: "Remove Metadata",
    description: "Purge editor metadata and namespaces",
  },
  {
    key: "removeEmptyGroups",
    label: "Remove Empty Groups",
    description: "Delete empty <g> wrappers",
  },
  {
    key: "cleanUnusedAttrs",
    label: "Clean Unused Attrs",
    description: "Drop redundant default attributes",
  },
  {
    key: "minifyXml",
    label: "Minify XML Code",
    description: "Collapse unnecessary whitespace",
  },
];

const PRECISIONS: SvgPrecision[] = [1, 2, 3];

export function OptimizationControls({
  options,
  onToggle,
  onPrecisionChange,
  onOptimize,
  isOptimizing,
  canOptimize,
}: OptimizationControlsProps) {
  const groupId = useId();

  const toggleColors = [
    "border-teal-400 bg-teal-50 text-teal-950 ring-teal-200",
    "border-blue-400 bg-blue-50 text-blue-950 ring-blue-200",
    "border-amber-400 bg-amber-50 text-amber-950 ring-amber-200",
    "border-fuchsia-400 bg-fuchsia-50 text-fuchsia-950 ring-fuchsia-200",
    "border-cyan-400 bg-cyan-50 text-cyan-950 ring-cyan-200",
  ];

  return (
    <section
      className="himat-panel p-4 sm:p-5"
      aria-labelledby="cleaner-rules-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2
            id="cleaner-rules-heading"
            className="text-base font-semibold text-slate-900"
          >
            SVG Cleaner &amp; Optimization Rules
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Toggle safer cleanups, then run Optimize SVG. Settings do not apply
            until you re-run.
          </p>
        </div>
        <button
          type="button"
          onClick={onOptimize}
          disabled={!canOptimize || isOptimizing}
          className="himat-cta inline-flex min-w-[140px] items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {isOptimizing ? "Optimizing…" : "Optimize SVG"}
        </button>
      </div>

      <fieldset className="mt-4">
        <legend className="sr-only">Optimization toggles</legend>
        <div className="flex flex-wrap gap-2">
          {TOGGLES.map((toggle, index) => {
            const checked = Boolean(options[toggle.key]);
            const id = `${groupId}-${toggle.key}`;
            const active = toggleColors[index % toggleColors.length];
            return (
              <label
                key={toggle.key}
                htmlFor={id}
                title={toggle.description}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm shadow-sm transition focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-teal-700 ${
                  checked
                    ? `${active} ring-1`
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <input
                  id={id}
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => onToggle(toggle.key, e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                  aria-describedby={`${id}-desc`}
                />
                <span className="font-medium">{toggle.label}</span>
                <span id={`${id}-desc`} className="sr-only">
                  {toggle.description}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="text-sm font-semibold text-slate-800">
          Precision
        </legend>
        <p className="mt-0.5 text-xs text-slate-500">
          Round path and shape coordinates to the selected decimal places.
        </p>
        <div
          className="mt-2 inline-flex rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 via-cyan-50 to-teal-50 p-1"
          role="radiogroup"
          aria-label="Coordinate precision"
        >
          {PRECISIONS.map((p) => {
            const selected = options.precision === p;
            return (
              <button
                key={p}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onPrecisionChange(p)}
                className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                  selected
                    ? "bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {p} decimal{p === 1 ? "" : "s"}
              </button>
            );
          })}
        </div>
      </fieldset>
    </section>
  );
}
