import { Text } from "@/components/text";
import { Link } from "@/components/link";
import { LogoMarquee } from "@/components/sponsor/LogoMarquee";
import { sponsors26 } from "@/constants/sponsors26";

/**
 * A slim rotation of this year's sponsors right under the hero, so they are
 * seen without scrolling. The full list, by tier, stays further down in
 * CurrentSponsors.
 */
const SponsorStrip = () => {
  if (sponsors26.length === 0) return null;

  return (
    <section className="flex w-full flex-col items-center gap-3 pt-10 lg:pt-16">
      <Link href="/#sponsors" className="transition hover:opacity-80">
        <Text as="p" textType="small" className="eyebrow-tbc text-center">
          This year&apos;s sponsors
        </Text>
      </Link>
      <LogoMarquee
        logos={sponsors26.map((sponsor) => ({
          name: sponsor.name,
          src: sponsor.src,
          website: sponsor.website,
          background: sponsor.background,
        }))}
        size="small"
        speed="52s"
      />
    </section>
  );
};

export default SponsorStrip;
