import Image from "next/image";
import { Text } from "@/components/text";
import { Link } from "@/components/link";
import { Sponsor26, SPONSOR26_TIERS, sponsors26 } from "@/constants/sponsors26";

/** Card size per tier: the higher the tier, the more room its logo gets. */
const TIER_CARD = {
  premium: "h-28 w-52 md:h-36 md:w-80",
  gold: "h-24 w-44 md:h-32 md:w-72",
  bronze: "h-20 w-40 md:h-28 md:w-60",
} as const;

const SponsorLogo = ({ name, tier, src, website, background }: Sponsor26) => {
  // Light logos would vanish on the white card, so they get a dark one.
  const cardBackground = background === "dark" ? "bg-white/[0.06]" : "bg-white";

  return (
    <Link
      href={website}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      className={`flex shrink-0 items-center justify-center rounded-md border border-line px-6 transition hover:border-line-strong ${TIER_CARD[tier]} ${cardBackground}`}
    >
      <div className="relative h-[70%] w-[85%]">
        <Image
          src={src}
          alt={name}
          fill
          sizes="(max-width: 768px) 208px, 320px"
          style={{ objectFit: "contain" }}
        />
      </div>
    </Link>
  );
};

/** This year's sponsors, above the past ones and larger than them. */
const CurrentSponsors = () => {
  const rows = SPONSOR26_TIERS.map((tier) => ({
    ...tier,
    sponsors: sponsors26.filter((sponsor) => sponsor.tier === tier.key),
  })).filter((row) => row.sponsors.length > 0);

  if (rows.length === 0) return null;

  return (
    <section
      className="w-full flex flex-col items-center gap-4"
      id="sponsors-26"
    >
      <Text as="p" textType="small" className="eyebrow-tbc text-center">
        Making it happen
      </Text>
      <Text textType={"sub_hero"} className="text-gradient text-center">
        Sponsors
      </Text>
      <Text
        as="p"
        textType="small"
        className="text-secondary max-w-2xl text-center mt-2"
      >
        These companies back the TUM Blockchain Conference 26. More are
        announced soon.
      </Text>

      <div className="mt-8 flex w-full flex-col items-center gap-8 md:gap-10">
        {rows.map((row) => (
          <div key={row.key} className="flex flex-col items-center gap-3">
            <Text
              as="p"
              textType="small"
              className="text-faint uppercase tracking-[0.2em]"
            >
              {row.label}
            </Text>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              {row.sponsors.map((sponsor) => (
                <SponsorLogo key={sponsor.src} {...sponsor} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CurrentSponsors;
