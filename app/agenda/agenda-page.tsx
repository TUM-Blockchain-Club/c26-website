import Agenda from "@/app/agenda/agenda";
import { Container } from "@/components/container";
import { Text } from "@/components/text";

/** The agenda page, shared by /agenda and every session's own page, which
 * is the same agenda with that session's dialog open. */
export const AgendaPageBody = ({
  initialSessionId,
}: {
  initialSessionId?: string;
}) => (
  // The 2026 programme is not final yet: the page shows the full agenda
  // layout with an empty session list until sessions are published.
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
        <Agenda
          sessions={[]}
          speakers={[]}
          initialSessionId={initialSessionId}
        />
      </Container>
    </main>
  </div>
);
