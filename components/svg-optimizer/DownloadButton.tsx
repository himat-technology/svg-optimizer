"use client";

import { useCallback, useState } from "react";

interface DownloadButtonProps {
  svg: string;
  filename: string;
  disabled?: boolean;
}

export function DownloadButton({
  svg,
  filename,
  disabled,
}: DownloadButtonProps) {
  const [error, setError] = useState<string | null>(null);

  const download = useCallback(() => {
    setError(null);
    try {
      const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.rel = "noopener";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } catch {
      setError("Unable to download the file. Please try again.");
    }
  }, [svg, filename]);

  return (
    <div>
      <button
        type="button"
        onClick={download}
        disabled={disabled || !svg}
        className="himat-cta inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
      >
        Download Optimized SVG
      </button>
      {error ? (
        <p className="mt-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
