"use client";

import { useState } from "react";
import { Text } from "@/components/text";
import { CopyButton } from "@/components/brand/CopyButton";
import type { Length, PlatformCopy } from "@/constants/partnerTimeline";

const LENGTHS: { key: Length; label: string }[] = [
  { key: "short", label: "Short" },
  { key: "medium", label: "Medium" },
  { key: "long", label: "Long" },
];

export const PartnerPostCard = ({ post }: { post: PlatformCopy }) => {
  const [length, setLength] = useState<Length>("long");
  const text = post.variants[length];
  const paragraphs = text.split("\n\n");

  return (
    <div className="card-tbc-soft flex h-full min-w-0 flex-col gap-5 p-6">
      <div className="flex flex-col gap-3">
        <Text as="p" textType="lgsmall" className="font-bold">
          {post.platform}
        </Text>

        <div className="flex flex-wrap gap-1.5">
          {LENGTHS.map((l) => (
            <button
              key={l.key}
              type="button"
              onClick={() => setLength(l.key)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                length === l.key
                  ? "border-line-strong bg-white/10 text-white"
                  : "border-line text-muted hover:text-white"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-3">
        {paragraphs.map((paragraph, i) => (
          <Text
            key={i}
            as="p"
            textType="small"
            className="text-secondary min-w-0 whitespace-pre-line break-words"
          >
            {paragraph}
          </Text>
        ))}
      </div>

      <div className="mt-auto pt-3">
        <CopyButton value={text} label={`Copy ${post.platform} text`} />
      </div>
    </div>
  );
};
