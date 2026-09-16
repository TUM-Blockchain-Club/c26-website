import { Text } from "@/components/text";
import { Button } from "@/components/button";
import { Link } from "@/components/link";

const PARTNERSHIP_DECK_URL = "https://tally.so/r/vGzv6g";

/**
 * Every way to take part beyond buying a ticket, in one place at the end of
 * the page: sponsorship, community and media partnerships, speaking. These
 * used to sit inside the past-sponsors section, and one of them again under
 * the community partners; the nav's "Become a Partner" lands here.
 */
const GetInvolved = () => {
  return (
    <section
      className="w-full flex flex-col items-center gap-4 scroll-mt-24"
      id="become-a-partner"
    >
      <Text as="p" textType="small" className="eyebrow-tbc text-center">
        Get involved
      </Text>
      <Text textType={"sub_hero"} className="text-gradient text-center">
        Partner With Us
      </Text>
      <Text
        as="p"
        textType="small"
        className="text-secondary max-w-2xl text-center mt-2"
      >
        Explore a partnership with the TUM Blockchain Conference &amp; Hackathon
        2026. Request the sponsorship deck, join us as a Community or Media
        Partner and help spread the word, or apply to speak.
      </Text>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
          <Link href="/become-partner?type=media">Become a Media Partner</Link>
        </Button>
        <Button buttonType="primary" asChild>
          <Link href="/speakers#apply">Become a Speaker</Link>
        </Button>
      </div>
    </section>
  );
};

export default GetInvolved;
