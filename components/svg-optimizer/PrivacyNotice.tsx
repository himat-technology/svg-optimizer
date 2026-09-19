"use client";

interface PrivacyNoticeProps {
  className?: string;
}

export function PrivacyNotice({ className = "" }: PrivacyNoticeProps) {
  return (
    <aside
      className={`relative overflow-hidden rounded-2xl border border-teal-200/70 bg-gradient-to-r from-teal-50 via-cyan-50 to-blue-50 px-4 py-4 text-sm text-teal-950 shadow-sm ${className}`}
      aria-label="Privacy notice"
    >
      <div
        aria-hidden
        className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-teal-300/40 to-blue-400/30 blur-xl"
      />
      <p className="relative font-semibold tracking-tight text-teal-900">
        <span className="mr-2 inline-flex rounded-full bg-gradient-to-r from-teal-600 to-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          Private
        </span>
        100% Browser-Local Processing
      </p>
      <p className="relative mt-1.5 text-teal-900/90">
        Your SVG never leaves your browser. SVG files are processed entirely in
        browser memory. No server upload is required.
      </p>
    </aside>
  );
}
