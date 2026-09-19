"use client";

import { useMemo, useState } from "react";
import { createSafePreviewDataUri } from "@/lib/svg";

interface SvgPreviewProps {
  svg: string;
  label: string;
  emptyMessage?: string;
}

function PreviewImage({
  dataUri,
  label,
}: {
  dataUri: string;
  label: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <p className="text-sm text-slate-500">Unable to render this SVG preview.</p>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={dataUri}
      alt={`${label} preview`}
      className="max-h-[260px] max-w-full object-contain"
      onError={() => setFailed(true)}
    />
  );
}

/**
 * Isolated SVG preview via <img src={data URI}>.
 * Loading SVG as an image prevents script execution.
 */
export function SvgPreview({
  svg,
  label,
  emptyMessage = "No SVG to preview yet.",
}: SvgPreviewProps) {
  const dataUri = useMemo(() => {
    if (!svg.trim()) {
      return null;
    }
    try {
      return createSafePreviewDataUri(svg);
    } catch {
      return null;
    }
  }, [svg]);

  return (
    <figure className="flex min-h-[220px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%,transparent_75%,#f8fafc_75%,#f8fafc),linear-gradient(45deg,#f8fafc_25%,transparent_25%,transparent_75%,#f8fafc_75%,#f8fafc)] bg-[length:16px_16px] bg-[position:0_0,8px_8px] bg-white">
      <figcaption className="border-b border-slate-200 bg-white/90 px-3 py-2 text-sm font-medium text-slate-800 backdrop-blur">
        {label}
      </figcaption>
      <div className="flex flex-1 items-center justify-center p-4">
        {!dataUri ? (
          <p className="text-sm text-slate-500">{emptyMessage}</p>
        ) : (
          <PreviewImage key={dataUri} dataUri={dataUri} label={label} />
        )}
      </div>
    </figure>
  );
}
