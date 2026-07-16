export const dynamic = "force-static";

import Agenda from "@/app/agenda/agenda";
import { Container } from "@/components/container";
import { Text } from "@/components/text";

const AgendaPage = () => {
  // The 2026 programme is not final yet: the page shows the full agenda
  // layout with an empty session list until sessions are published.
  return (
    <div className={"flex justify-center"}>
      <main className={"w-full h-full max-w-7xl pt-page-pt lg:pt-0 z-20 pb-40"}>
        <Container>
          <div className={"mt-page-top md:mt-page-top-lg z-10 max-w-3xl"}>
            <div className="lg:flex items-center">
              <Text textType={"sub_hero"} className="text-gradient text-left">
                Stay On Track With Our Agenda
              </Text>
            </div>
          </div>
          <Agenda sessions={[]} speakers={[]} />
        </Container>
      </main>
    </div>
  );
};

export default AgendaPage;
