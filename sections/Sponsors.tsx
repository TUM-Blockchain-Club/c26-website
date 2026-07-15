import { Text } from "@/components/text";
import { Button } from "@/components/button";
import { Sponsor } from "@/components/sponsor/Sponsor";
import { Link } from "@/components/link";
import {
  bronzeSponsors,
  goldSponsors,
  platinumSponsors,
  SponsorData,
  silverSponsors,
} from "@/constants/PastSponsors";
import Image from "next/image";

const PARTNERSHIP_DECK_URL = "https://tally.so/r/vGzv6g";

// Helper function to chunk an array into groups of specified size
const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

type SponsorsProps = {
  displayMode?: "carousel" | "grid";
};

type SponsorCarouselProps = {
  sponsors: SponsorData[];
  size: "large" | "small";
  reverse?: boolean;
};

const SponsorCarousel = ({ sponsors, size, reverse }: SponsorCarouselProps) => {
  // 4 copies, animated by -50% (= 2 full sets), so the loop stays seamless
  // and the strip always exceeds the container width at any window size.
  const repeatedSponsors = [...sponsors, ...sponsors, ...sponsors, ...sponsors];
  const animationName = reverse ? "sponsor-marquee-reverse" : "sponsor-marquee";
  const speed = size === "large" ? "72s" : "88s";
  const itemClassName =
    size === "large"
      ? "h-24 w-44 xs:h-28 xs:w-56 md:h-32 md:w-72"
      : "h-16 w-32 xs:h-20 xs:w-40 md:h-24 md:w-52";

  return (
    <div className="relative w-full overflow-hidden py-2">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-black to-transparent md:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-black to-transparent md:w-28" />
      <div
        className="flex w-max gap-4 md:gap-6"
        style={{
          animation: `${animationName} ${speed} linear infinite`,
        }}
      >
        {repeatedSponsors.map((sponsor, index) => (
          <Link
            key={`${sponsor.alt}-${index}`}
            href={sponsor.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`sponsor-carousel-card flex shrink-0 items-center justify-center rounded-md border border-line bg-white px-5 transition hover:border-line-strong ${itemClassName}`}
          >
            <Image
              src={sponsor.imageSrc}
              alt={sponsor.alt}
              width={260}
              height={130}
              className="max-h-[70%] w-auto max-w-[85%] object-contain"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

const Sponsors = ({ displayMode = "carousel" }: SponsorsProps) => {
  const topCarouselSponsors = [...platinumSponsors, ...goldSponsors];
  const bottomCarouselSponsors = [...silverSponsors, ...bronzeSponsors];
  const goldSponsorRows = [
    goldSponsors.slice(0, 2),
    goldSponsors.slice(2, 4),
    goldSponsors.slice(4),
  ].filter((row) => row.length > 0);

  if (displayMode === "carousel") {
    return (
      <section
        className="w-full flex flex-col items-center gap-4"
        id="sponsors"
      >
        <style>{`
          @keyframes sponsor-marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }

          @keyframes sponsor-marquee-reverse {
            from { transform: translateX(-50%); }
            to { transform: translateX(0); }
          }
        `}</style>
        <Text as="p" textType="small" className="eyebrow-tbc text-center">
          They made it possible
        </Text>
        <Text textType={"sub_hero"} className="text-gradient text-center">
          Past Sponsors
        </Text>
        <div className="w-full flex flex-col items-center gap-8 lg:gap-12 mt-8">
          <div className="flex w-full flex-col gap-5 md:gap-7">
            <SponsorCarousel sponsors={topCarouselSponsors} size="large" />
            <SponsorCarousel
              sponsors={bottomCarouselSponsors}
              size="small"
              reverse
            />
          </div>

          <div
            id="become-a-partner"
            className="flex max-w-3xl flex-col items-center gap-5 text-center scroll-mt-24"
          >
            <Text as="p" textType="small" className="text-secondary">
              Explore a partnership with the TUM Blockchain Conference &
              Hackathon 2026. Request the sponsorship deck, or join us as a
              Community or Media Partner and help spread the word.
            </Text>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button buttonType="cta" asChild>
                <Link
                  href={PARTNERSHIP_DECK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Request Partnership Deck
                </Link>
              </Button>
              <Button buttonType="primary" asChild>
                <Link href="/become-partner?type=community">
                  Become a Community Partner
                </Link>
              </Button>
              <Button buttonType="primary" asChild>
                <Link href="/become-partner?type=media">
                  Become a Media Partner
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/*
          Old grouped display method:

          <Text textType={"title"} className="text-gradient font-bold">
            Platinum
          </Text>
          <div className={"glow"}>
            {platinumSponsors.map((sponsor) => (
              <Sponsor key={sponsor.alt} alt={sponsor.alt} sponsorType="platinum" link={sponsor.link} imageSrc={sponsor.imageSrc} className={sponsor.className} />
            ))}
          </div>

          <Text textType={"title"} className="text-gradient font-medium">
            Gold
          </Text>
          <div className="flex flex-col gap-4 glow md:col-span-2">
            {goldSponsorRows.map((row, rowIndex) => (
              <div key={rowIndex} className={`flex flex-row gap-4 glow ${rowIndex === goldSponsorRows.length - 1 && row.length === 1 ? "justify-center w-content" : "md:col-span-2"}`}>
                {row.map((sponsor) => (
                  <Sponsor key={sponsor.alt} alt={sponsor.alt} sponsorType="gold" link={sponsor.link} imageSrc={sponsor.imageSrc} className={sponsor.className} />
                ))}
              </div>
            ))}
          </div>

          <Text textType={"title"}>Silver</Text>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {silverSponsors.map((sponsor) => (
              <Sponsor key={sponsor.alt} alt={sponsor.alt} sponsorType="silver" link={sponsor.link} imageSrc={sponsor.imageSrc} className={sponsor.className} />
            ))}
          </div>

          <Text textType={"title"}>Bronze</Text>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {bronzeSponsors.map((sponsor) => (
              <Sponsor key={sponsor.alt} alt={sponsor.alt} sponsorType="bronze" link={sponsor.link} imageSrc={sponsor.imageSrc} className={sponsor.className} />
            ))}
          </div>
        */}
      </section>
    );
  }

  return (
    <section
      className="w-full flex flex-col items-center gap-12 lg:gap-20"
      id="sponsors"
    >
      <Text textType={"sub_hero"} className="text-gradient text-center">
        Past Sponsors
      </Text>

      {/* Platinum Sponsors */}
      <Text textType={"title"} className="text-gradient font-bold">
        Platinum
      </Text>
      <div className={"glow"}>
        {platinumSponsors.map((sponsor) => (
          <Sponsor
            key={sponsor.alt}
            alt={sponsor.alt}
            sponsorType="platinum"
            link={sponsor.link}
            imageSrc={sponsor.imageSrc}
            className={sponsor.className}
          />
        ))}
      </div>

      {/* Gold Sponsors */}
      <Text textType={"title"} className="text-gradient font-medium">
        Gold
      </Text>
      <div className="flex flex-col gap-4 glow md:col-span-2">
        {goldSponsorRows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`flex flex-row gap-4 glow ${
              rowIndex === goldSponsorRows.length - 1 && row.length === 1
                ? "justify-center w-content"
                : "md:col-span-2"
            }`}
          >
            {row.map((sponsor) => (
              <Sponsor
                key={sponsor.alt}
                alt={sponsor.alt}
                sponsorType="gold"
                link={sponsor.link}
                imageSrc={sponsor.imageSrc}
                className={sponsor.className}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Silver Sponsors */}
      <Text textType={"title"}>Silver</Text>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {silverSponsors.map((sponsor) => (
          <Sponsor
            key={sponsor.alt}
            alt={sponsor.alt}
            sponsorType="silver"
            link={sponsor.link}
            imageSrc={sponsor.imageSrc}
            className={sponsor.className}
          />
        ))}
      </div>

      {/* Bronze Sponsors */}
      <Text textType={"title"}>Bronze</Text>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {bronzeSponsors.map((sponsor) => (
          <Sponsor
            key={sponsor.alt}
            alt={sponsor.alt}
            sponsorType="bronze"
            link={sponsor.link}
            imageSrc={sponsor.imageSrc}
            className={sponsor.className}
          />
        ))}
      </div>
    </section>
  );
};

export default Sponsors;
