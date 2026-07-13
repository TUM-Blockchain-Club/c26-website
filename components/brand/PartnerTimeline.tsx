import { Text } from "@/components/text";
import { PartnerPostCard } from "@/components/brand/PartnerPostCard";
import { PartnerVideoAsset } from "@/components/brand/PartnerVideoAsset";
import {
  partnerCheckpoints,
  PARTNER_TIMELINE_START,
  PARTNER_TIMELINE_END,
} from "@/constants/partnerTimeline";

const percentAlong = (dateIso: string) => {
  const start = new Date(PARTNER_TIMELINE_START).getTime();
  const end = new Date(PARTNER_TIMELINE_END).getTime();
  const date = new Date(dateIso).getTime();
  return Math.min(100, Math.max(0, ((date - start) / (end - start)) * 100));
};

const StatusBadge = ({ done, next }: { done: boolean; next: boolean }) => {
  if (done)
    return (
      <span className="rounded-full bg-track-education/15 px-3 py-1 text-xs font-bold text-track-education">
        Done
      </span>
    );
  if (next)
    return (
      <span className="rounded-full bg-gradient-tbc px-3 py-1 text-xs font-bold text-black">
        Up next
      </span>
    );
  return (
    <span className="rounded-full border border-line px-3 py-1 text-xs text-muted">
      Upcoming
    </span>
  );
};

export const PartnerTimeline = () => {
  const now = Date.now();
  const start = new Date(PARTNER_TIMELINE_START).getTime();
  const end = new Date(PARTNER_TIMELINE_END).getTime();
  const progress = Math.min(
    100,
    Math.max(0, ((now - start) / (end - start)) * 100),
  );

  const EARLY_BIRD_END = "2026-07-31";
  const earlyBirdPct = percentAlong(EARLY_BIRD_END);
  const earlyBirdOver = now > new Date(EARLY_BIRD_END).getTime();

  const nextCheckpointId = partnerCheckpoints.find(
    (c) => new Date(c.date).getTime() > now,
  )?.id;

  return (
    <div className="flex flex-col gap-16">
      {/* Timeline: a gradient rail that fills day by day and ends at the
         conference itself, beaconing at the finish line. The Early Bird
         deadline is flagged with its date above the rail. */}
      <div className="flex flex-col">
        {/* Early Bird deadline, above the rail with a connector down to it */}
        <div className="relative h-16">
          <div
            className="absolute bottom-0 flex -translate-x-1/2 flex-col items-center"
            style={{ left: `${earlyBirdPct}%` }}
          >
            <Text
              as="span"
              textType="small"
              className={`whitespace-nowrap font-bold ${
                earlyBirdOver ? "text-faint" : "text-tbc-yellow"
              }`}
            >
              {earlyBirdOver ? "Early Bird ended" : "Early Bird ends"}
            </Text>
            <Text
              as="span"
              textType="small"
              className="mt-0.5 whitespace-nowrap text-secondary"
            >
              31 Jul
            </Text>
            <span
              className={`mt-1.5 h-4 w-px ${
                earlyBirdOver ? "bg-white/25" : "bg-tbc-yellow/80"
              }`}
              aria-hidden
            />
          </div>
        </div>

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
              style={{ left: `${Math.min(62, Math.max(4, progress))}%` }}
            >
              Today
            </Text>
          )}
          <div className="absolute right-0 top-0 flex flex-col items-end gap-1 text-right">
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

      <div className="flex flex-col gap-24">
        {partnerCheckpoints.map((cp) => {
          const done = new Date(cp.date).getTime() <= now;
          const isNext = cp.id === nextCheckpointId;

          return (
            <section key={cp.id} className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                  <div className="flex flex-col gap-2">
                    <Text as="p" textType="sub_title" className="font-bold">
                      {cp.label}
                    </Text>
                    <Text as="p" textType="lgsmall" className="text-secondary">
                      {cp.periodLabel}
                    </Text>
                  </div>
                  <StatusBadge done={done} next={isNext} />
                </div>

                <Text
                  as="p"
                  textType="paragraph"
                  className="text-secondary max-w-2xl leading-relaxed"
                >
                  {cp.task}
                </Text>
              </div>

              {cp.showVideo && <PartnerVideoAsset />}

              {cp.suggestCardGenerator && (
                <a
                  href="#card-generator"
                  className="card-tbc-soft flex items-center justify-between gap-3 p-4 no-underline transition-colors hover:border-line-strong hover:no-underline"
                >
                  <Text textType="small" className="text-secondary">
                    Need a visual for this post? Generate a partner card below.
                  </Text>
                  <Text
                    textType="small"
                    className="font-bold text-white shrink-0"
                  >
                    Card Generator ↓
                  </Text>
                </a>
              )}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {cp.posts.map((post) => (
                  <PartnerPostCard key={post.platform} post={post} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
