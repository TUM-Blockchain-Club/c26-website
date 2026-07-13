"use client";

import { useState } from "react";
import { Text } from "@/components/text";

/** Small inline value that copies itself to the clipboard on click. */
export const CopyField = ({
  value,
  label,
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
      aria-label={`Copy ${label ?? value} to clipboard`}
      className="group/copy flex items-center gap-1.5 rounded-sm px-1 -mx-1 text-left transition-colors hover:bg-white/5"
    >
      <Text
        as="span"
        textType="small"
        className="font-mono text-secondary group-hover/copy:text-white"
      >
        {value}
      </Text>
      <Text
        as="span"
        textType="small"
        className="text-faint opacity-0 transition-opacity group-hover/copy:opacity-100"
      >
        {copied ? "copied" : "copy"}
      </Text>
    </button>
  );
};
