import Link from "next/link";
import { SITE } from "@/lib/site";

const socialLinks = [
  { label: "Facebook", href: SITE.social.facebook, color: "bg-[#1877F2] hover:brightness-110" },
  { label: "LinkedIn", href: SITE.social.linkedin, color: "bg-[#0A66C2] hover:brightness-110" },
  { label: "Instagram", href: SITE.social.instagram, color: "bg-gradient-to-br from-[#f59e0b] via-[#ec4899] to-[#8b5cf6] hover:brightness-110" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
        >
          <span
            aria-hidden
            className="himat-float grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-teal-500 via-blue-500 to-fuchsia-500 text-sm font-bold text-white shadow-lg shadow-blue-500/30"
          >
            H
          </span>
          <span className="text-sm font-semibold tracking-tight text-slate-900 sm:text-base">
            {SITE.name}
          </span>
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-2 sm:gap-3">
          <a
            href={`tel:${SITE.phoneTel}`}
            className="hidden rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 transition hover:bg-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 sm:inline-flex"
          >
            {SITE.phoneDisplay}
          </a>
          <Link
            href="/free-tools/svg-optimizer"
            className="rounded-full bg-gradient-to-r from-teal-600 to-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-teal-500/25 transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 sm:text-sm"
          >
            SVG Optimizer
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-slate-200/80 bg-slate-950 text-slate-200">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_240px_at_20%_0%,rgba(20,184,166,0.25),transparent),radial-gradient(500px_220px_at_90%_20%,rgba(59,130,246,0.22),transparent)]"
      />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md space-y-2">
            <p className="text-lg font-semibold text-white">{SITE.name}</p>
            <p className="text-sm text-slate-300">
              Free browser-local developer tools. Your SVG never leaves your
              browser.
            </p>
            <p className="text-sm">
              <span className="text-slate-400">Call us: </span>
              <a
                href={`tel:${SITE.phoneTel}`}
                className="font-semibold text-amber-300 underline-offset-2 hover:text-amber-200 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
              >
                {SITE.phoneDisplay}
              </a>
            </p>
            <a
              href={SITE.demoSvgOptimizer}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex text-sm font-medium text-cyan-300 underline-offset-2 hover:text-cyan-200 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            >
              Live demo → himat.tech
            </a>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Follow HiMat
            </p>
            <ul className="flex flex-wrap gap-2">
              {socialLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center rounded-full px-3.5 py-2 text-xs font-semibold text-white shadow-md transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${item.color}`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-1 border-t border-white/10 pt-5 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>SVG processing runs locally in your browser.</p>
          <p>© {new Date().getFullYear()} {SITE.name}</p>
        </div>
      </div>
    </footer>
  );
}
