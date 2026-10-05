import { StageGridAgenda } from "@/components/agenda/StageGridAgenda";

/** The Digital Assets Day half of the programme, on the day's own page. */
export const DigitalAssetsDayAgenda = () => (
  <StageGridAgenda
    event="digital-assets-day"
    accent={{ rule: "border-blue-400/30", title: "text-blue-200" }}
    stages={[
      { name: "Main Stage", subtitle: "Classic conference set up" },
      { name: "Executive Forum", subtitle: "Curated deep dive formats" },
      { name: "Future Stage", subtitle: "Industry and technology in practice" },
    ]}
    intro={
      <>
        Three stages running in parallel: the Main Stage sets the agenda, the
        Executive Forum goes deep in curated formats, and the Future Stage shows
        what industry already builds. All three open together with the joint
        opening session. This is Bundesblock&apos;s working draft and may still
        change, and only speakers who have confirmed are named.
      </>
    }
  />
);

export default DigitalAssetsDayAgenda;
