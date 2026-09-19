"use client";

import { formatBytes, type SvgOptimizationResult } from "@/lib/svg";

interface OptimizationStatsProps {
  result: SvgOptimizationResult | null;
}

const STAT_STYLES = [
  {
    wrap: "border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100/80",
    label: "text-slate-500",
    value: "text-slate-900",
  },
  {
    wrap: "border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50",
    label: "text-teal-700",
    value: "text-teal-950",
  },
  {
    wrap: "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50",
    label: "text-amber-700",
    value: "text-amber-950",
  },
  {
    wrap: "border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50",
    label: "text-blue-700",
    value: "text-blue-950",
  },
] as const;

export function OptimizationStats({ result }: OptimizationStatsProps) {
  if (!result) {
    return (
      <section
        className="himat-panel p-4 sm:p-5"
        aria-labelledby="stats-heading"
      >
        <h2
          id="stats-heading"
          className="text-base font-semibold text-slate-900"
        >
          Statistics
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Run Optimize SVG to see real byte savings and node cleanup counts.
        </p>
      </section>
    );
  }

  const stats = [
    {
      label: "Original Size",
      value: formatBytes(result.originalBytes),
    },
    {
      label: "Optimized Size",
      value: formatBytes(result.optimizedBytes),
    },
    {
      label: "Bandwidth Saved",
      value: `${result.bandwidthSavedPercent}%`,
    },
    {
      label: "Nodes Cleaned",
      value: `${result.originalNodeCount.toLocaleString("en-US")} → ${result.optimizedNodeCount.toLocaleString("en-US")}`,
    },
  ];

  return (
    <section
      className="himat-panel p-4 sm:p-5"
      aria-labelledby="stats-heading"
      aria-live="polite"
    >
      <h2 id="stats-heading" className="text-base font-semibold text-slate-900">
        Statistics
      </h2>
      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat, index) => {
          const style = STAT_STYLES[index] ?? STAT_STYLES[0];
          return (
            <div
              key={stat.label}
              className={`rounded-xl border px-3 py-3 shadow-sm ${style.wrap}`}
            >
              <dt
                className={`text-xs font-semibold uppercase tracking-wide ${style.label}`}
              >
                {stat.label}
              </dt>
              <dd
                className={`mt-1 font-mono text-lg font-bold tabular-nums ${style.value}`}
              >
                {stat.value}
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
