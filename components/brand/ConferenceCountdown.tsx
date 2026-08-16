"use client";

import { useEffect, useState } from "react";
import { Text } from "@/components/text";

// Doors open on day 1 (Munich is CET at the end of October).
const CONFERENCE_START = new Date("2026-10-29T09:00:00+01:00").getTime();
const CONFERENCE_END = new Date("2026-10-31T23:59:59+01:00").getTime();

type Remaining = { d: number; h: number; m: number; s: number };

const remainingUntilStart = (): Remaining | null => {
  const diff = CONFERENCE_START - Date.now();
  if (diff <= 0) return null;
  return {
    d: Math.floor(diff / 86_400_000),
    h: Math.floor(diff / 3_600_000) % 24,
    m: Math.floor(diff / 60_000) % 60,
    s: Math.floor(diff / 1_000) % 60,
  };
};

const Unit = ({ value, label }: { value: number; label: string }) => (
  <span className="flex items-baseline gap-1">
    <span className="font-display text-lg font-bold tabular-nums md:text-xl">
      {String(value).padStart(2, "0")}
    </span>
    <span className="text-[0.6rem] uppercase tracking-widest text-faint">
      {label}
    </span>
  </span>
);

/**
 * Live countdown to the conference doors, ticking every second. Computed
 * client-side after mount so the statically built page never mismatches.
 * During the conference it flips to "Happening now"; afterwards it hides.
 */
export const ConferenceCountdown = () => {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (now === null) {
    // Reserve the pill's height until the client takes over.
    return <span className="h-10" aria-hidden />;
  }

  if (now > CONFERENCE_END) return null;

  const left = remainingUntilStart();

  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-line bg-white/5 px-5 py-2 backdrop-blur-sm">
      {left ? (
        <>
          <Unit value={left.d} label="d" />
          <span className="text-faint" aria-hidden>
            ·
          </span>
          <Unit value={left.h} label="h" />
          <span className="text-faint" aria-hidden>
            ·
          </span>
          <Unit value={left.m} label="m" />
          <span className="text-faint" aria-hidden>
            ·
          </span>
          <Unit value={left.s} label="s" />
          <Text
            as="span"
            textType="small"
            className="ml-1 hidden font-bold uppercase tracking-widest text-secondary sm:inline"
          >
            until doors open
          </Text>
        </>
      ) : (
        <Text
          as="span"
          textType="lgsmall"
          className="font-bold uppercase tracking-widest text-tbc-yellow"
        >
          Happening now
        </Text>
      )}
    </div>
  );
};

export default ConferenceCountdown;
