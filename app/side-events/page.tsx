import { Container } from "@/components/container";
import { Events } from "@/components/event/Events";
import { Text } from "@/components/text";
import { fetchSideEvents, SideEvent } from "@/components/service/contentStrapi";

export default async function SideEvents() {
  const sideEvents: SideEvent[] = await fetchSideEvents();

  const items = sideEvents.map((e) => ({
    title: e.title,
    description: e.description,
    image: e.image?.url || "/side-events/pre-event.jpg",
    startTime: e.startTime,
    endTime: e.endTime,
    link: e.link,
  }));

  return (
    <div className={"overflow-x-hidden"}>
      <main className={"w-full pt-[25px] lg:pt-0 z-20 2xl:px-[225px] pb-40"}>
        <Container>
          <div className={"mt-[100px] md:mt-[20vh] z-10 w-full max-w-7xl mx-auto"}>
            <Text
              textType={"sub_hero"}
              className="text-gradient text-left mb-20"
              as="p"
            >
              Side Events
            </Text>
            {/* <Events items={items} /> */}
            <Text textType={"sub_title"} className="text-gradient">
              Side events will be announced soon
            </Text>
          </div>
        </Container>
      </main>
    </div>
  );
}
