import { Text } from "@/components/text";
import { PartnerPostCard } from "@/components/brand/PartnerPostCard";
import { PartnerVideoAsset } from "@/components/brand/PartnerVideoAsset";
import { TimelineRail } from "@/components/brand/TimelineRail";
import { partnerCheckpoints } from "@/constants/partnerTimeline";

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

  const nextCheckpointId = partnerCheckpoints.find(
    (c) => new Date(c.date).getTime() > now,
  )?.id;

  return (
    <div className="flex flex-col gap-16">
      <TimelineRail />

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
