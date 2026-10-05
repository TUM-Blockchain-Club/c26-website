import { StageGridAgenda } from "@/components/agenda/StageGridAgenda";

/** The First Conference Day half of the programme, on the day's own page. */
export const ConferenceDayAgenda = () => (
  <StageGridAgenda
    event="conference"
    accent={{ rule: "border-tbc-yellow/30", title: "text-tbc-yellow" }}
    stages={[
      { name: "Nakamoto", subtitle: "The main stage" },
      { name: "Turing", subtitle: "Research and cryptography" },
      { name: "Hopper", subtitle: "Building, security and community" },
    ]}
    intro={
      <>
        Three stages running in parallel, named after Nakamoto, Turing and
        Hopper: Nakamoto carries the main programme, Turing the research track,
        and Hopper what builders and the community are working on. They are the
        same three rooms the Digital Assets Day uses the next day under its own
        names. The programme is still being finalised, and only speakers who
        have confirmed are named.
      </>
    }
  />
);

export default ConferenceDayAgenda;
