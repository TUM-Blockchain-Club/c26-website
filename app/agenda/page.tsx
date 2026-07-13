export const dynamic = "force-static";

import Agenda from "@/app/agenda/agenda";
import { Container } from "@/components/container";
import { Text } from "@/components/text";
import { useSession } from "@/hooks/useSession";
import { Session, Stages, Tracks } from "@/model/session";
import { fetchSessions } from "@/components/service/contentStrapi_static";
import { fetchSpeakers } from "@/components/service/contentStrapi";
import { notFound } from "next/navigation";

const AgendaPage = async () => {
  // Agenda subpage is temporarily disabled.
  notFound();

  const sessions = await fetchSessions();
  const speakers = await fetchSpeakers();

  return (
    <div className={"flex justify-center"}>
      <main className={"w-full h-full max-w-7xl pt-page-pt lg:pt-0 pb-40"}>
        <Container>
          <div className={"mt-page-top md:mt-page-top-lg z-10"}>
            <div className="flex items-center overflow-hidden h-30">
              <Text
                textType={"sub_hero"}
                className="text-gradient text-left text-top h-40"
              >
                Stay On Track With Our Agenda
              </Text>
            </div>
          </div>
          <Agenda sessions={sessions} speakers={speakers} />
        </Container>
      </main>
    </div>
  );
};

export default AgendaPage;
