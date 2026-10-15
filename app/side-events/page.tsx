import { Container } from "@/components/container";
import { SideEventList } from "@/components/event/SideEventList";
import { Text } from "@/components/text";
import ScheduleOverview from "@/components/schedule/ScheduleOverview";

/** Rebuilt in the background once the cached list is older than this, so an
 * event added in Strapi appears without a deploy. */
// A literal, because Next reads segment config statically. Keep it in step
// with the cache lifetime in components/service/conference26.ts.
export const revalidate = 60;

export default function SideEvents() {
  return (
    <div className={"overflow-x-hidden"}>
      <main className={"w-full pt-page-pt lg:pt-0 z-20 2xl:px-[225px] pb-40"}>
        <Container>
          <div
            className={
              "mt-page-top md:mt-page-top-lg z-10 w-full max-w-7xl mx-auto flex flex-col gap-4"
            }
          >
            <Text as="p" textType="small" className="eyebrow-tbc text-left">
              Around the conference
            </Text>
            <Text textType={"sub_hero"} className="text-gradient text-left">
              Side Events
            </Text>
            <Text
              as="p"
              textType="paragraph"
              className="text-secondary max-w-2xl leading-relaxed"
            >
              Other people&apos;s events in the same week, each with its own
              host and its own registration.
            </Text>
            <div className="mt-6">
              <SideEventList />
            </div>

            <Text
              as="p"
              textType="small"
              className="eyebrow-tbc text-left mt-24"
            >
              Four days, one journey
            </Text>
            <div className="mt-4">
              <ScheduleOverview />
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
