"use client";

import { useState } from "react";
import { CopyIcon, CheckIcon } from "@radix-ui/react-icons";

/** Copy-to-clipboard button for long values (captions, links) — unlike
 * CopyField, it never echoes the value back (that's already shown by the
 * caller), so it can't overflow its own box regardless of value length. */
export const CopyButton = ({
  value,
  label = "Copy",
}: {
  value: string;
  label?: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API can be unavailable (insecure context, permissions).
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${label} to clipboard`}
      className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-bold text-secondary transition-colors hover:border-line-strong hover:text-white"
    >
      {copied ? (
        <CheckIcon className="h-3.5 w-3.5" />
      ) : (
        <CopyIcon className="h-3.5 w-3.5" />
      )}
      {copied ? "Copied" : label}
    </button>
  );
};
