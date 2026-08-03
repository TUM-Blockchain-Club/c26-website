import { Text } from "@/components/text";
import {
  PARTNER_TIMELINE_START,
  PARTNER_TIMELINE_END,
} from "@/constants/partnerTimeline";

/**
 * The campaign progress rail: a gradient track filling day by day towards the
 * conference. Shared between the partner and media portals.
 */
export const TimelineRail = () => {
  const now = Date.now();
  const start = new Date(PARTNER_TIMELINE_START).getTime();
  const end = new Date(PARTNER_TIMELINE_END).getTime();
  const progress = Math.min(
    100,
    Math.max(0, ((now - start) / (end - start)) * 100),
  );

  return (
    <div className="flex flex-col">
      <div className="relative h-3 w-full">
        {/* Full journey, faintly tinted in the brand gradient */}
        <div className="absolute inset-0 rounded-full bg-gradient-tbc opacity-25" />

        {/* Progress so far */}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-tbc shadow-[0_0_18px_rgb(var(--color-brand-red-rgb)/0.6)]"
          style={{ width: `${progress}%` }}
        />

        {/* Today marker */}
        {progress > 1 && progress < 96 && (
          <div
            className="absolute -bottom-2 -top-2 w-0.5 -translate-x-1/2 rounded-full bg-white shadow-[0_0_8px_rgb(255_255_255/0.8)]"
            style={{ left: `${progress}%` }}
            aria-hidden
          />
        )}

        {/* The conference, beaconing at the finish line */}
        <span
          className="absolute right-0 top-1/2 flex h-6 w-6 -translate-y-1/2"
          aria-hidden
        >
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tbc-purple opacity-60 motion-reduce:animate-none" />
          <span className="relative inline-flex h-6 w-6 rounded-full bg-gradient-tbc shadow-[0_0_20px_rgb(var(--color-brand-purple-rgb)/0.8)]" />
        </span>
      </div>

      {/* Below the rail: Today marker label, and the destination anchored
         right under the beacon. Today is clamped left so they can't collide. */}
      <div className="relative mt-2.5 min-h-[3.25rem]">
        {progress > 1 && progress < 96 && (
          <Text
            as="span"
            textType="small"
            className="absolute top-0 -translate-x-1/2 whitespace-nowrap font-bold text-white"
            style={{ left: `${Math.min(48, Math.max(4, progress))}%` }}
          >
            Today
          </Text>
        )}
        <div className="absolute right-0 top-0 flex max-w-[7.5rem] flex-col items-end gap-1 text-right sm:max-w-none">
          <Text
            as="span"
            textType="lgsmall"
            className="font-bold text-gradient"
          >
            TUM Blockchain Conference 26
          </Text>
          <Text as="span" textType="small" className="text-secondary">
            Oct 29 to 31 · Munich
          </Text>
        </div>
      </div>
    </div>
  );
};
