import Image from "next/image";
import { Text } from "@/components/text";
import { Button } from "@/components/button";
import Link from "next/link";

type Partner = { alt: string; src: string; href?: string };

function PartnerGrid({
  partners,
  featured = false,
}: {
  partners: Partner[];
  featured?: boolean;
}) {
  const itemBox = featured
    ? "w-[220px] h-[120px] md:w-[170px] md:h-[110px]"
    : "w-[150px] h-[100px] md:w-[170px] md:h-[110px]";

  return (
    <div
      className={[
        "flex flex-wrap items-center justify-center",
        "gap-x-10 gap-y-8 md:gap-x-12 md:gap-y-10",
        "mx-auto max-w-5xl",
      ].join(" ")}
    >
      {partners.map((p, i) => {
        const content = (
          <div
            key={p.alt + i}
            className={[
              "relative",
              itemBox,
              "transition-transform duration-200 hover:scale-[1.03]",
            ].join(" ")}
            aria-label={p.alt}
          >
            <Image
              alt={p.alt}
              src={p.src}
              fill
              sizes="(max-width: 768px) 170px, 170px"
              style={{ objectFit: "contain" }}
              priority={featured}
            />
          </div>
        );

        return p.href ? (
          <a
            key={p.alt + i}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="focus:outline-none focus:ring-2 focus:ring-white/40 rounded-xl"
          >
            {content}
          </a>
        ) : (
          content
        );
      })}
    </div>
  );
}

const Partners = () => {
  const knowledge: Partner[] = [
    { alt: "IEEE Blockchain", src: "/papers/ieee_logo.png" },
  ];

  const media: Partner[] = [
    { alt: "POAP", src: "/partners/poap_logo.png" },
    { alt: "CryptoNewsZ", src: "/partners/cryptonewsz_logo.png" },
    { alt: "DroomDroom", src: "/partners/DroomDroom_logo.png" },
    { alt: "TheNewsCrypto", src: "/partners/thenewscrypto_logo.png" },
    { alt: "CryptoNews", src: "/partners/cryptonews_logo.png" },
    { alt: "Coin Gabbar", src: "/partners/coin_gabbar_logo.png" },
    // { alt: "Web3 Vision", src: "/partners/w3.vision_white.png" },
    // { alt: "Werk1", src: "/partners/werk1.png" },
    // { alt: "BTC Echo", src: "/partners/btc_echo_logo.png" },
    // { alt: "Superteam Germany", src: "/partners/superteam_de_logo.png" },
    // { alt: "The Coin Republic", src: "/partners/tcr_logo.png" },
    // { alt: "The Market Periodical", src: "/partners/tmp_logo.png" },
  ];

  const community: Partner[] = [
    { alt: "Technische Universität München", src: "/partners/tum_logo.png" },
    { alt: "Bundesblock", src: "/partners/bundesblock_logo.png" },
    { alt: "CONF3RENCE", src: "/partners/conf3rence_logo.png" },
    { alt: "ETH Bratislava", src: "/partners/eth_bratislava_logo.png" },
    { alt: "ETH Warsaw", src: "/partners/eth_warsaw_logo.png" },
    { alt: "FIL-B", src: "/partners/fil_b_logo.png" },
    { alt: "Frankfurt School", src: "/partners/frankfurt_school_logo.png" },
    { alt: "Kryptosphere", src: "/partners/kryptosphere_logo.png" },
    { alt: "Superteam Germany", src: "/partners/superteam_de_logo.png" },
    {
      alt: "Blockchain for Europe",
      src: "/partners/blockchain_europe_logo.png",
    },
    // { alt: "Encode Club", src: "/partners/encode_logo.png" },
    {
      alt: "Blockchain Bayern e.V.",
      src: "/partners/blockchain_bayern_logo.png",
    },
    { alt: "w3", src: "/partners/w3.png" },
    // { alt: "GTU Blockchain", src: "/partners/gtub_logo_white.png" },
    { alt: "DLT Talents Alumni", src: "/partners/DLT_Talents_logo.png" },
    // { alt: "UnternehmerTUM", src: "/partners/UnternehmerTUM.png" },
    // { alt: "BAF", src: "/partners/baf.png" },
    // { alt: "PretzelDAO", src: "/partners/pretzeldao-logo.png" },
    // { alt: "CollegeDAO", src: "/partners/collegeDAO_logo.png" },
    // { alt: "Deutsches Museum", src: "/partners/DM_Logo.png" },
    // { alt: "Acconsis", src: "/partners/Acconsis.png" },
    // { alt: "CryptoChicks", src: "/partners/CryptoChicks.png" },
    // { alt: "HerDAO", src: "/partners/HERDAO.png" },
    // { alt: "SystAIn3r", src: "/partners/systain3r.png" },
    // { alt: "w3muc", src: "/partners/w3muc.jpeg" },
    // { alt: "TUM Venture Labs", src: "/partners/venture_labs.png" },
    // { alt: "Blockchain Bundesverband", src: "/partners/bundesblock_logo.png" },
  ];

  return (
    <section className="w-full flex flex-col items-center gap-16 lg:gap-24">
      <div className="w-full flex justify-center">
        <Text textType={"sub_hero"} className="text-gradient">
          Last Year's Partners
        </Text>
      </div>

      {/* Knowledge Partner */}
      <div className="flex flex-col items-center gap-6 lg:gap-10 w-full">
        <Text className="text-center" as="p" textType={"sub_title"}>
          Knowledge Partner
        </Text>
        <PartnerGrid partners={knowledge} featured />
      </div>

      {/* Media Partners */}
      <div className="flex flex-col items-center gap-6 lg:gap-10 w-full">
        <Text className="text-center" as="p" textType={"sub_title"}>
          Media Partners
        </Text>
        <PartnerGrid partners={media} />
      </div>

      {/* Community Partners */}
      <div className="flex flex-col items-center gap-6 lg:gap-10 w-full">
        <Text className="text-center" as="p" textType={"sub_title"}>
          Community Partners
        </Text>
        <PartnerGrid partners={community} />
      </div>

      <Button buttonType={"primary"} asChild>
        <Link href={"https://conference25.tum-blockchain.com/"}>
          Throwback 2025
        </Link>
      </Button>
    </section>
  );
};

export default Partners;
