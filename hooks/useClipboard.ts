"use client";

import { useCallback, useState } from "react";

export interface UseClipboardResult {
  copy: (text: string) => Promise<boolean>;
  copied: boolean;
  error: string | null;
  reset: () => void;
}

/**
 * Clipboard helper with temporary "Copied!" feedback and graceful fallback.
 */
export function useClipboard(resetMs = 2000): UseClipboardResult {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setCopied(false);
    setError(null);
  }, []);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      setError(null);

      try {
        if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          // Fallback for older browsers
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.setAttribute("readonly", "");
          textarea.style.position = "fixed";
          textarea.style.left = "-9999px";
          document.body.appendChild(textarea);
          textarea.select();
          const ok = document.execCommand("copy");
          document.body.removeChild(textarea);
          if (!ok) {
            throw new Error("Copy command failed");
          }
        }

        setCopied(true);
        window.setTimeout(() => setCopied(false), resetMs);
        return true;
      } catch {
        setError("Unable to copy to clipboard. Please copy manually.");
        setCopied(false);
        return false;
      }
    },
    [resetMs],
  );

  return { copy, copied, error, reset };
}
