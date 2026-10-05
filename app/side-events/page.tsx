import { Container } from "@/components/container";
import { SideEventList } from "@/components/event/SideEventList";
import { Text } from "@/components/text";
import ScheduleOverview from "@/components/schedule/ScheduleOverview";

// Side events come from constants/sideEvents26.ts, not from Strapi: the page
// used to fetch them and then render a placeholder instead, and the production
// token has no read access to that collection anyway.
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
              Four days, one journey
            </Text>
            <div className="mt-4">
              <ScheduleOverview />
            </div>
            <Text
              textType={"sub_hero"}
              className="text-gradient text-left mt-12"
            >
              Side Events
            </Text>
            <Text
              as="p"
              textType="paragraph"
              className="text-secondary max-w-3xl leading-relaxed"
            >
              Events other people run in the same week, in or near the same
              house. Each one has its own host and its own registration, so a
              conference ticket does not get you in.
            </Text>
            <div className="mt-6">
              <SideEventList />
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
