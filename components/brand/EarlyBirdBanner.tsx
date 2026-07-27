"use client";

import { useEffect, useState } from "react";
import { Text } from "@/components/text";

const EARLY_BIRD_END = "2026-07-31";

const daysUntilDeadline = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(`${EARLY_BIRD_END}T00:00:00`);
  return Math.round((deadline.getTime() - today.getTime()) / 86_400_000);
};

/**
 * Understated Early Bird note for the hero: states the explicit deadline
 * ("Early Bird until July 31") with a subtle live day count. The countdown
 * is computed on the client after mount so it is always current for the
 * visitor and never mismatches the statically built page.
 */
export const EarlyBirdBanner = () => {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    setDays(daysUntilDeadline());
  }, []);

  // Deadline already passed — don't advertise Early Bird anymore.
  if (days !== null && days < 0) {
    return null;
  }

  const countdown =
    days === null
      ? null
      : days === 0
        ? "ends today"
        : days === 1
          ? "1 day left"
          : `${days} days left`;

  return (
    <div className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white/5 px-4 py-1.5 backdrop-blur-sm">
      <span
        className="h-1.5 w-1.5 shrink-0 rounded-full bg-tbc-yellow motion-safe:animate-pulse"
        aria-hidden
      />
      <Text as="span" textType="small" className="font-semibold tracking-wide">
        Early Bird tickets until July 31
      </Text>
      {countdown && (
        <>
          <span className="h-3 w-px bg-line" aria-hidden />
          <Text
            as="span"
            textType="small"
            className="font-semibold text-tbc-yellow"
          >
            {countdown}
          </Text>
        </>
      )}
    </div>
  );
};

export default EarlyBirdBanner;
