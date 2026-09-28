import Image from "next/image";
import { Text } from "@/components/text";
import { Link } from "@/components/link";
import {
  Sponsor26,
  Sponsor26Tier,
  SPONSOR26_TRACKS,
  sponsors26,
} from "@/constants/sponsors26";

/**
 * How each tier looks. The ladder has to be readable at a glance, so rank is
 * carried by four things at once rather than by a four-pixel difference in
 * card height: the card size, a glow that only the top two tiers get, the
 * size of the tier label, and its colour.
 *
 * The colour encodes rank, not the metal in the name: first place is a cool
 * platinum white, second gold, third silver, fourth bronze. That way the
 * Hackathon ladder (Premium, Standard, Travel) reads the same way as the
 * conference one without borrowing its tier names.
 */
type TierStyle = {
  /** Card footprint. */
  card: string;
  /** Glow and ring around the card. Empty for the lower tiers. */
  halo: string;
  /** Tier label above the row. */
  label: string;
  /** Label colour. */
  tone: string;
};

const RANK_1 = {
  halo: "ring-1 ring-white/35 shadow-[0_0_46px_-6px_rgba(232,236,244,0.45)]",
  label: "text-sm md:text-base",
  tone: "text-[#EDEFF5]",
};
const RANK_2 = {
  halo: "ring-1 ring-[#FFC110]/30 shadow-[0_0_34px_-8px_rgba(255,193,16,0.38)]",
  label: "text-sm",
  tone: "text-[#FFC110]",
};
const RANK_3 = {
  halo: "ring-1 ring-white/10",
  label: "text-xs",
  tone: "text-[#C7CBD4]",
};
const RANK_4 = { halo: "", label: "text-xs", tone: "text-[#C08457]" };

const TIER_STYLE: Record<Sponsor26Tier, TierStyle> = {
  platinum: { card: "h-32 w-56 md:h-44 md:w-[23rem]", ...RANK_1 },
  gold: { card: "h-28 w-48 md:h-36 md:w-80", ...RANK_2 },
  silver: { card: "h-24 w-44 md:h-28 md:w-64", ...RANK_3 },
  bronze: { card: "h-20 w-36 md:h-24 md:w-52", ...RANK_4 },
  // Not a paid tier, so it sits below the ladder and says so by being quiet.
  partner: {
    card: "h-16 w-32 md:h-20 md:w-44",
    halo: "",
    label: "text-xs",
    tone: "text-faint",
  },
  premium: { card: "h-32 w-56 md:h-44 md:w-[23rem]", ...RANK_1 },
  standard: { card: "h-28 w-48 md:h-36 md:w-80", ...RANK_2 },
  travel: { card: "h-20 w-36 md:h-24 md:w-52", ...RANK_3 },
};

const SponsorLogo = ({
  name,
  tier,
  src,
  website,
  background,
  muted,
}: Sponsor26 & { muted?: boolean }) => {
  // Light logos would vanish on the white card, so they get a dark one. A
  // muted tier dims the card itself rather than the logo — the artwork keeps
  // its own colours either way.
  const cardBackground =
    background === "dark"
      ? muted
        ? "bg-white/[0.03]"
        : "bg-white/[0.06]"
      : muted
        ? "bg-white/80"
        : "bg-white";

  return (
    <Link
      href={website}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      className={`flex shrink-0 items-center justify-center rounded-md border px-6 transition hover:border-line-strong ${
        muted ? "border-line-subtle" : "border-line"
      } ${TIER_STYLE[tier].card} ${TIER_STYLE[tier].halo} ${cardBackground}`}
    >
      <div className="relative h-[74%] w-[88%]">
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

/** This year's sponsors, above the past ones and larger than them. Split by
 * track, because the conference and the Hackathon have their own tier
 * ladders — side by side they would read as one ranking. */
const CurrentSponsors = () => {
  const tracks = SPONSOR26_TRACKS.map((track) => ({
    ...track,
    rows: track.tiers
      .map((tier) => ({
        ...tier,
        sponsors: sponsors26.filter((sponsor) => sponsor.tier === tier.key),
      }))
      .filter((row) => row.sponsors.length > 0),
  })).filter((track) => track.rows.length > 0);

  if (tracks.length === 0) return null;

  return (
    <section
      className="w-full flex flex-col items-center gap-4 scroll-mt-24"
      id="sponsors"
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

      <div className="mt-10 flex w-full flex-col items-center gap-12 md:gap-16">
        {tracks.map((track) => (
          <div
            key={track.key}
            className="flex w-full flex-col items-center gap-10 md:gap-12"
          >
            <div className="flex w-full max-w-3xl items-center gap-4">
              <span className="h-px flex-1 bg-line" />
              <Text as="p" textType="sub_title" className="font-bold">
                {track.label}
              </Text>
              <span className="h-px flex-1 bg-line" />
            </div>

            {track.rows.map((row) => (
              <div key={row.key} className="flex flex-col items-center gap-4">
                <p
                  className={`font-semibold uppercase tracking-[0.28em] ${TIER_STYLE[row.key].label} ${TIER_STYLE[row.key].tone}`}
                >
                  {row.label}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
                  {row.sponsors.map((sponsor) => (
                    <SponsorLogo
                      key={sponsor.src}
                      {...sponsor}
                      muted={row.muted}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CurrentSponsors;
