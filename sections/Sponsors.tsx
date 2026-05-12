import { Text } from "@/components/text";
import { Sponsor } from "@/components/sponsor/Sponsor";

interface SponsorData {
  alt: string;
  link: string;
  imageSrc: string;
  className?: string;
}

const platinumSponsors: SponsorData[] = [
  {
    alt: "Bitvavo",
    link: "https://bitvavo.com/",
    imageSrc: "/sponsors/bitvavo_logo.png",
    className: "!p-0",
  },
];

const goldSponsors: SponsorData[] = [
  {
    alt: "Ethereum Ecosystem Support Program",
    link: "https://ethereum.org/",
    imageSrc: "/sponsors/ethereum_fas_logo.png",
  },
  {
    alt: "Ledger",
    link: "https://www.ledger.com/",
    imageSrc: "/sponsors/ledger_logo.png",
  },
  {
    alt: "Base",
    link: "https://www.base.org/",
    imageSrc: "/sponsors/base_logo.png",
  },
];

const silverSponsors: SponsorData[] = [
  {
    alt: "XRP Ledger",
    link: "https://www.xrpl-commons.org/",
    imageSrc: "/sponsors/xrpl.png",
    className: "!p-2",
  },
  {
    alt: "IOTA",
    link: "https://www.iota.org/",
    imageSrc: "/sponsors/iota_logo.png",
  },
  {
    alt: "Polkadot",
    link: "https://polkadot.com/",
    imageSrc: "/sponsors/Polkadot_Logo.png",
  },
];

const bronzeSponsors: SponsorData[] = [
  {
    alt: "neodyme",
    link: "https://neodyme.io/",
    imageSrc: "/sponsors/neodyme_logo.png",
    className: "!p-4 md:!p-9",
  },
  {
    alt: "Staking Facilities",
    link: "https://stakingfacilities.com/",
    imageSrc: "/sponsors/staking_facilities_logo.png",
  },
  {
    alt: "Space Computer",
    link: "https://www.spacecomputer.io/",
    imageSrc: "/sponsors/spacecomputer_logo.png",
  },
  {
    alt: "Arcium",
    link: "https://www.arcium.com/",
    imageSrc: "/sponsors/arcium_logo.png",
  },
  {
    alt: "fetch.ai",
    link: "https://fetch.ai/",
    imageSrc: "/sponsors/fetch_ai_logo.png",
  },
  {
    alt: "Bosch",
    link: "https://www.bosch.com/",
    imageSrc: "/sponsors/bosch_logo.png",
  },
  {
    alt: "Filecoin Orbit",
    link: "https://filecoin.io/",
    imageSrc: "/sponsors/filecoin_orbit_logo.png",
  },
  {
    alt: "Zircuit",
    link: "https://zircuit.com/",
    imageSrc: "/sponsors/zircuit_logo.png",
  },
  {
    alt: "Giessecke Devrient",
    link: "https://www.giessecke-devrient.com",
    imageSrc: "/sponsors/giessecke_devrient_logo.png",
    className: "!p-8",
  },
  {
    alt: "Gnosis",
    link: "https://www.gnosis.io/",
    imageSrc: "/sponsors/gnosis_logo.png",
  },
  {
    alt: "TUM Venture Labs",
    link: "https://venturelabs.tum.de/",
    imageSrc: "/sponsors/utum_venturelabs_logo.png",
  },
];

// Helper function to chunk an array into groups of specified size
const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

const Sponsors = () => {
  // Create rows for gold sponsors: 2, 2, and remaining
  const goldSponsorRows = [
    goldSponsors.slice(0, 2),
    goldSponsors.slice(2, 4),
    goldSponsors.slice(4),
  ].filter((row) => row.length > 0);

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
