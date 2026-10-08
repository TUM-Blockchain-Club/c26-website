import { Text } from "@/components/text";

type Row = {
  date: string;
  title: string;
  line: string;
};

const ROWS: Row[] = [
  {
    date: "29 Oct",
    title: "TUM Blockchain Conference Day",
    line: "Talks and panels — from zero-knowledge cryptography to production systems.",
  },
  {
    date: "30 Oct",
    title: "Digital Assets Day",
    line: "Curated by Bundesblock: policymakers, regulators, financial institutions and corporates.",
  },
  {
    date: "30–31 Oct",
    title: "Blockchain & AI Hackathon",
    line: "Two days of building alongside the conference, open to all levels.",
  },
];

/**
 * The three formats as an editorial schedule table, set like the printed
 * flyer: dates in a left column, formats on hairline-separated rows. Quiet
 * typography over decoration.
 */
const ThreeDays = () => {
  return (
    <section className="flex w-full justify-center scroll-mt-24" id="programme">
      <div className="flex w-full max-w-4xl flex-col">
        <Text as="p" textType="small" className="eyebrow-tbc">
          One ticket, three formats
        </Text>
        <Text textType={"sub_hero"} className="text-gradient mt-4">
          Three Days
        </Text>

        <div className="mt-10 border-t border-white/10">
          {ROWS.map((row) => (
            <div
              key={row.title}
              className="grid grid-cols-1 items-start gap-x-8 gap-y-2 border-b border-white/10 py-7 transition-colors hover:bg-white/[0.03] md:grid-cols-[9rem_1fr] md:py-8"
            >
              <Text
                as="p"
                textType="lgsmall"
                className="font-bold tabular-nums text-white"
              >
                {row.date}
              </Text>
              <div className="flex flex-col gap-1.5">
                <Text textType="sub_title" className="font-bold">
                  {row.title}
                </Text>
                <Text
                  as="p"
                  textType="small"
                  className="max-w-xl leading-relaxed text-muted"
                >
                  {row.line}
                </Text>
              </div>
            </div>
          ))}
        </div>

        <Text as="p" textType="small" className="mt-5 text-faint">
          One ticket covers all three days.
        </Text>
      </div>
    </section>
  );
};

export default ThreeDays;
