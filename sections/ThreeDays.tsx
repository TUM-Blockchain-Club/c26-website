import { Text } from "@/components/text";
import Image from "next/image";
import DigitalAssetsDayLogo from "@/public/logos/digital-assets-day-logo.png";

type Row = {
  date: string;
  title: string;
  line: string;
  logo?: typeof DigitalAssetsDayLogo;
  logoAlt?: string;
};

const ROWS: Row[] = [
  {
    date: "29 Oct",
    title: "Conference Day",
    line: "Talks and panels — from zero-knowledge cryptography to production systems.",
  },
  {
    date: "30 Oct",
    title: "Digital Assets Day",
    line: "Curated by Bundesblock: policymakers, regulators, financial institutions and corporates.",
    logo: DigitalAssetsDayLogo,
    logoAlt: "Digital Assets Day",
  },
  {
    date: "30–31 Oct",
    title: "Blockchain & AI Hackathon",
    line: "Two days of building alongside the conference, open to all levels.",
  },
];

/**
 * The three formats as an editorial schedule table, set like the printed
 * flyer: dates in a left column, formats on hairline-separated rows, the
 * Digital Assets Day mark sitting on its own row. Quiet typography over
 * decoration.
 */
const ThreeDays = () => {
  return (
    <section className="flex w-full justify-center">
      <div className="flex w-full max-w-4xl flex-col">
        <Text as="p" textType="small" className="eyebrow-tbc">
          Three days, three formats
        </Text>

        <div className="mt-8 border-t border-white/10">
          {ROWS.map((row) => (
            <div
              key={row.title}
              className="grid grid-cols-1 items-start gap-x-8 gap-y-2 border-b border-white/10 py-7 transition-colors hover:bg-white/[0.03] md:grid-cols-[9rem_1fr_auto] md:py-8"
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
              {row.logo && (
                <Image
                  src={row.logo}
                  alt={row.logoAlt ?? ""}
                  className="mt-1 hidden h-7 w-auto md:block"
                />
              )}
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
