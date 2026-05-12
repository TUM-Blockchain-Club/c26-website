export const dynamic = "force-static";

import { Container } from "@/components/container";
import { Text } from "@/components/text";
import { WorkshopsContainer } from "@/components/workshops/WorkshopsContainer";
import { workshopItems } from "@/constants/WorkshopData";
import { fetchWorkshops, Workshop } from "@/components/service/contentStrapi";

export default async function Workshops() {
  const workshops: Workshop[] = await fetchWorkshops();

  const items = workshops.map((e) => ({
    title: e.title,
    description: e.description,
    backgroundImg: e.backgroundImg?.url || "/workshops/default-workshop.png",
    url: e.url,
    starttime: e.starttime,
    endtime: e.endtime,
    room: e.room,
  }));

  return (
    <div className={"overflow-x-hidden"}>
      <main className={"w-full pt-[25px] lg:pt-0 z-20 2xl:px-[225px] pb-40"}>
        <Container>
          <div
            className={"mt-[100px] md:mt-[20vh] z-10 w-full max-w-7xl mx-auto"}
          >
            <Text
              textType={"sub_hero"}
              className="text-gradient text-left mb-20"
              as="p"
            >
              Last Year's Workshops
            </Text>
            <WorkshopsContainer items={items} />
          </div>
        </Container>
      </main>
    </div>
  );
}
