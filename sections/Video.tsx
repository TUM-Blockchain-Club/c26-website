"use client";

import Image from "next/image";
import { useState } from "react";
import { Link } from "@/components/link";
import { Text } from "@/components/text";
import {
  AFTERMOVIE_EMBED_URL,
  AFTERMOVIE_WATCH_URL,
} from "@/constants/mediaPortal";

/**
 * Last year's aftermovie. The YouTube player is only loaded once someone
 * clicks play: it keeps the page light, sets no YouTube cookies for people
 * who never watch, and — the reason this was rebuilt — a blocked embed used
 * to leave an empty gradient rectangle on the homepage. Now the poster stays,
 * with a link out to YouTube when the player itself cannot load.
 */
const Video = () => {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="w-full flex flex-col items-center gap-4">
      <Text as="p" textType="small" className="eyebrow-tbc text-center">
        Look back
      </Text>
      <Text textType={"sub_hero"} className="text-gradient text-center">
        Aftermovie
      </Text>
      <div className="mt-8 w-full max-w-[340px] sm:max-w-[560px] rounded-2xl bg-gradient-tbc p-[3px] shadow-glow">
        <div
          className="relative w-full overflow-hidden rounded-[calc(1rem-3px)] bg-black"
          style={{ aspectRatio: "16 / 9" }}
        >
          {playing ? (
            <iframe
              src={`${AFTERMOVIE_EMBED_URL}?autoplay=1`}
              title="TUM Blockchain Conference 25 aftermovie"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group absolute inset-0 h-full w-full"
              aria-label="Play the conference 25 aftermovie"
            >
              <Image
                src="/media/aftermovie-poster.jpg"
                alt="TUM Blockchain Conference 25 aftermovie"
                fill
                sizes="(max-width: 640px) 340px, 560px"
                className="object-cover"
              />
              <span className="absolute inset-0 bg-black/25 transition group-hover:bg-black/10" />
              <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 ring-1 ring-white/30 transition group-hover:bg-black/85">
                <span className="ml-1 block h-0 w-0 border-y-[11px] border-l-[18px] border-y-transparent border-l-white" />
              </span>
            </button>
          )}
        </div>
      </div>
      <Link
        href={AFTERMOVIE_WATCH_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-faint transition hover:text-secondary"
      >
        Watch on YouTube
      </Link>
    </section>
  );
};

export default Video;
