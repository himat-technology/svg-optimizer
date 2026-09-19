import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "HiMat Technology — Free Developer Tools",
  description:
    "Browser-local developer tools from HiMat Technology, including the SVG Optimizer & Vector Cleaner.",
};

export default function HomePage() {
  return (
    <main className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-teal-400/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 bottom-8 h-64 w-64 rounded-full bg-blue-500/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/3 top-1/2 h-40 w-40 rounded-full bg-amber-400/20 blur-3xl"
      />

      <p className="relative text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
        {SITE.name}
      </p>
      <h1 className="himat-hero-title relative mt-3 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
        Free tools that keep your files in the browser.
      </h1>
      <p className="relative mt-4 max-w-xl text-lg text-slate-600">
        Start with the SVG Optimizer &amp; Vector Cleaner — compress and sanitize
        SVG graphics with zero server uploads.
      </p>
      <div className="relative mt-8 flex flex-wrap items-center gap-3">
        <Link
          href="/free-tools/svg-optimizer"
          className="himat-cta inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          Open SVG Optimizer
        </Link>
        <a
          href={SITE.demoSvgOptimizer}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-white/80 px-5 py-3 text-sm font-semibold text-blue-800 shadow-sm transition hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Live demo
        </a>
        <a
          href={`tel:${SITE.phoneTel}`}
          className="inline-flex items-center justify-center rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-900 transition hover:bg-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
        >
          Call {SITE.phoneDisplay}
        </a>
      </div>
    </main>
  );
}
