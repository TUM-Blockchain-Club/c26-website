"use client";

import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { FileText, Image as ImageIcon, Presentation } from "lucide-react";
import { Text } from "@/components/text";
import type { AgendaTalk } from "@/constants/digitalAssetsDayAgenda";

/**
 * The slides the speaker uploaded on the session in Strapi, each opening in
 * a new tab. Strapi forbids framing its files, so they are linked rather than
 * embedded; the browser's own viewer shows a PDF and offers the download.
 */
type Slide = NonNullable<AgendaTalk["slides"]>[number];

const isPdf = (f: Slide) =>
  f.mime === "application/pdf" || /\.pdf$/i.test(f.name);

/** Where the link goes: the converted PDF of a deck once there is one, so it
 * opens in the browser instead of downloading as .pptx. */
const hrefOf = (f: Slide) => f.pdf ?? f.src;

const kindOf = (f: Slide) => {
  if (isPdf(f) || f.pdf) return { label: "PDF", Icon: FileText };
  if (f.mime.startsWith("image/"))
    return { label: f.mime.slice(6).toUpperCase(), Icon: ImageIcon };
  const ext = /\.([a-z0-9]+)$/i.exec(f.name)?.[1];
  return { label: ext ? ext.toUpperCase() : "File", Icon: Presentation };
};

/** "Bitz Compressed.pdf" -> "Bitz Compressed" */
const titleOf = (f: Slide) => f.name.replace(/\.[a-z0-9]+$/i, "") || "Slides";

const sizeOf = (kb?: number) => {
  if (!kb) return undefined;
  return kb >= 1000 ? `${(kb / 1000).toFixed(1)} MB` : `${Math.round(kb)} kB`;
};

export const SessionSlides = ({ talk }: { talk: AgendaTalk }) => {
  const slides = talk.slides ?? [];
  if (!slides.length) return null;

  return (
    <div className="flex flex-col gap-2">
      <Text as="p" textType="small" className="font-bold text-white">
        Slides
      </Text>
      <ul className="flex flex-col gap-2">
        {slides.map((f) => {
          const { label, Icon } = kindOf(f);
          const size = f.pdf ? undefined : sizeOf(f.size);
          return (
            <li key={f.src}>
              <a
                href={hrefOf(f)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  window.plausible?.("Slides Open", {
                    props: { session: talk.id },
                  })
                }
                className="group flex items-center gap-3 rounded-lg border border-line px-3 py-2.5 transition-colors hover:border-line-strong hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/[0.06] text-secondary group-hover:text-white">
                  <Icon className="h-[18px] w-[18px]" aria-hidden />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-bold leading-snug text-white">
                    {titleOf(f)}
                  </span>
                  <span className="text-xs leading-snug text-faint">
                    {[label, size].filter(Boolean).join(" | ")}
                  </span>
                </span>
                <ExternalLinkIcon
                  className="h-4 w-4 shrink-0 text-secondary transition-colors group-hover:text-white"
                  aria-label="Opens in a new tab"
                />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
