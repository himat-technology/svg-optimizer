"use client";

import { useCallback, useId, useRef } from "react";
import { isValidSvgMarkup } from "@/lib/svg";

interface UploadSvgProps {
  onLoad: (content: string, filename: string) => void;
  onError: (message: string) => void;
  disabled?: boolean;
}

export function UploadSvg({ onLoad, onError, disabled }: UploadSvgProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const readFile = useCallback(
    async (file: File) => {
      if (!file.name.toLowerCase().endsWith(".svg") && file.type !== "image/svg+xml") {
        onError("Unsupported file type. Please upload a .svg file.");
        return;
      }

      try {
        const text = await file.text();
        if (!isValidSvgMarkup(text)) {
          onError("Please provide a valid SVG file or SVG markup.");
          return;
        }
        onLoad(text, file.name);
      } catch {
        onError("Unable to read the selected file. Please try again.");
      }
    },
    [onLoad, onError],
  );

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        void readFile(file);
      }
      // Allow re-selecting the same file
      event.target.value = "";
    },
    [readFile],
  );

  return (
    <>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept=".svg,image/svg+xml"
        className="sr-only"
        onChange={onChange}
        disabled={disabled}
        aria-label="Upload SVG file"
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center justify-center rounded-xl border border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50 px-3.5 py-2 text-sm font-semibold text-teal-900 shadow-sm transition hover:from-teal-100 hover:to-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Upload .svg
      </button>
    </>
  );
}
