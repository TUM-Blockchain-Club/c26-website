import { Text } from "@/components/text";
import { Sponsor } from "@/components/sponsor/Sponsor";
import { LogoMarquee } from "@/components/sponsor/LogoMarquee";
import {
  bronzeSponsors,
  goldSponsors,
  platinumSponsors,
  SponsorData,
  silverSponsors,
} from "@/constants/PastSponsors";
import Image from "next/image";

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

/** Past sponsors are stored with alt/imageSrc; the marquee wants name/src. */
const toMarqueeLogo = (sponsor: SponsorData) => ({
  name: sponsor.alt,
  src: sponsor.imageSrc,
  website: sponsor.link,
});

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
        className="w-full flex flex-col items-center gap-4 scroll-mt-24"
        id="past-sponsors"
      >
        <Text as="p" textType="small" className="eyebrow-tbc text-center">
          They made it possible
        </Text>
        <Text textType={"title"} className="text-gradient text-center">
          Past Sponsors
        </Text>
        <div className="w-full flex flex-col items-center gap-6 lg:gap-10 mt-4">
          <div className="flex w-full flex-col gap-3 md:gap-4">
            <LogoMarquee
              logos={topCarouselSponsors.map(toMarqueeLogo)}
              size="large"
              speed="60s"
            />
            <LogoMarquee
              logos={bottomCarouselSponsors.map(toMarqueeLogo)}
              size="small"
              speed="74s"
              reverse
            />
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
