import Agenda from "@/app/agenda/agenda";
import { Container } from "@/components/container";
import { Text } from "@/components/text";
import { AgendaDataProvider } from "@/components/agenda/AgendaData";
import {
  getAgendaEntries,
  getSpeakers,
} from "@/components/service/conference26";
import { speakerLinksFrom } from "@/util/speakerPortraits";

/** The agenda page, shared by /agenda and every session's own page, which
 * is the same agenda with that session's dialog open.
 *
 * The programme and the speakers are read from Strapi here, on the server,
 * and handed to the browser side of the agenda in one go. */
export const AgendaPageBody = async ({
  initialSessionId,
}: {
  initialSessionId?: string;
}) => {
  const [entries, speakers] = await Promise.all([
    getAgendaEntries(),
    getSpeakers(),
  ]);

  return (
    <div className={"flex justify-center"}>
      <main className={"w-full h-full max-w-7xl pt-page-pt lg:pt-0 z-20 pb-40"}>
        <Container>
          <div className={"mt-page-top md:mt-page-top-lg z-10 max-w-3xl"}>
            <Text
              textType={"sub_hero"}
              className="text-gradient text-left inline-block pb-2 leading-[1.15]"
            >
              Stay On Track With Our Agenda
            </Text>
          </div>
          <AgendaDataProvider
            data={{ entries, speakers: speakerLinksFrom(speakers) }}
          >
            <Agenda initialSessionId={initialSessionId} />
          </AgendaDataProvider>
        </Container>
      </main>
    </div>
  );
};
