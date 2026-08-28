import Image from "next/image";
import { Text } from "@/components/text";
import { Button } from "@/components/button";
import { Link } from "@/components/link";
import {
  fetchCommunityPartners,
  CommunityPartner,
} from "@/components/service/contentStrapi";

const PartnerLogo = ({ partner }: { partner: CommunityPartner }) => {
  const src = partner.logo?.url;
  if (!src) return null;

  // Light logos would vanish on the white card, so they get a dark one.
  // See util/logoTone.ts — the tone is measured from the logo's pixels.
  const cardBackground =
    partner.logoBackground === "dark" ? "bg-white/[0.06]" : "bg-white";

  // Logos added after the last build are served from Strapi; the optimizer
  // would need the host allow-listed and would reject their SVGs.
  const isRemote = src.startsWith("http");

  const logo = (
    <div
      className={`flex h-24 w-40 shrink-0 items-center justify-center rounded-md border border-line px-5 transition hover:border-line-strong md:h-28 md:w-52 ${cardBackground}`}
    >
      <div className="relative h-[70%] w-[85%]">
        <Image
          src={src}
          alt={partner.name}
          fill
          sizes="(max-width: 768px) 160px, 208px"
          unoptimized={isRemote}
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );

  return partner.website ? (
    <Link
      href={partner.website}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-md focus:outline-none focus:ring-2 focus:ring-white/40"
    >
      {logo}
    </Link>
  ) : (
    logo
  );
};

/**
 * This year's Community Partners, maintained in Strapi. Renders nothing until
 * the first partner is published there, so the homepage stays clean.
 */
const CommunityPartners = async () => {
  const partners = await fetchCommunityPartners();
  const withLogo = partners.filter((partner) => partner.logo?.url);

  if (withLogo.length === 0) return null;

  return (
    <section
      className="w-full flex flex-col items-center gap-4"
      id="community-partners"
    >
      <Text as="p" textType="small" className="eyebrow-tbc text-center">
        Standing with us
      </Text>
      <Text textType={"sub_hero"} className="text-gradient text-center">
        Community Partners
      </Text>
      <Text
        as="p"
        textType="small"
        className="text-secondary max-w-2xl text-center mt-2"
      >
        These communities support the TUM Blockchain Conference 26. More are
        announced regularly.
      </Text>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:gap-6">
        {withLogo.map((partner) => (
          <PartnerLogo key={partner.documentId} partner={partner} />
        ))}
      </div>

      <div className="mt-8">
        <Button buttonType="primary" asChild>
          <Link href="/become-partner?type=community">
            Become a Community Partner
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default CommunityPartners;
