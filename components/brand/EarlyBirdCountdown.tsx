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
 * Live badge for the Early Bird checkpoint: counts down the days to the
 * deadline. Computed on the client after mount so it is always current for
 * the visitor (and never mismatches a statically built page).
 */
export const EarlyBirdCountdown = () => {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    setDays(daysUntilDeadline());
  }, []);

  if (days === null) {
    // Reserve space until the client computes the current value.
    return <span className="h-7" aria-hidden />;
  }

  if (days < 0) {
    return (
      <span className="rounded-full border border-line px-3 py-1 text-xs text-muted">
        Early Bird ended
      </span>
    );
  }

  const label =
    days === 0
      ? "Early Bird ends today"
      : days === 1
        ? "Early Bird ends tomorrow"
        : `Early Bird ends in ${days} days`;

  return (
    <span className="rounded-full bg-tbc-yellow/15 px-3 py-1 ring-1 ring-inset ring-tbc-yellow/40">
      <Text as="span" textType="small" className="font-bold text-tbc-yellow">
        {label}
      </Text>
    </span>
  );
};

export default EarlyBirdCountdown;
