import Image from "next/image";
import { Text } from "@/components/text";
import { Button } from "@/components/button";
import { Link } from "@/components/link";
import { HACKATHON_URL } from "@/constants/Links";
import DigitalAssetsDayLogo from "@/public/logos/digital-assets-day-logo.png";
import HackathonLogo from "@/public/logos/hackathon-logo.png";

const DIGITAL_ASSETS_DAY_URL =
  "https://www.canva.com/design/DAHPRPSDUTQ/JpFOcfDLmVRT0uZcoVEgnA/view?utm_content=DAHPRPSDUTQ&utm_campaign=designshare&utm_medium=link&utm_source=viewer";

const WhatsNew = () => {
  return (
    <section className="w-full flex flex-col items-center gap-4" id="whats-new">
      <Text as="p" textType="small" className="eyebrow-tbc text-center">
        New in 2026
      </Text>
      <Text textType={"sub_hero"} className="text-gradient text-center">
        What&apos;s New This Year
      </Text>
      <div className="w-full flex justify-center mt-8">
        <div className="w-full flex flex-col items-center lg:flex-row lg:items-stretch lg:justify-center gap-4 lg:gap-6">
          <div className="card-tbc w-full relative max-w-[320px] sm:max-w-[30rem] p-8 flex flex-col items-center h-full hover:-translate-y-1">
            <Image
              src={DigitalAssetsDayLogo}
              alt="Digital Assets Day"
              className="h-[70px] sm:h-[86px] w-auto"
            />
            <div className="mt-5 px-4 py-1.5 rounded-full border border-line bg-white/5">
              <Text
                textType={"small"}
                className="text-white font-bold tracking-wide"
              >
                October 30, 2026
              </Text>
            </div>
            <Text
              textType={"lgsmall"}
              as="p"
              className="text-left text-gray-400 mt-6 max-w-[260px] sm:max-w-[42rem] leading-relaxed"
            >
              For the first time, the second conference day will be curated by
              Bundesblock, bringing together policymakers, regulators, financial
              institutions, corporates and digital asset leaders to discuss the
              future of digital assets in Europe.
            </Text>
            <div className="mt-auto pt-8">
              <Button buttonType={"cta"} asChild className="w-fit">
                <Link
                  href={DIGITAL_ASSETS_DAY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
          <div className="card-tbc w-full relative max-w-[320px] sm:max-w-[30rem] p-8 flex flex-col items-center h-full hover:-translate-y-1">
            <Image
              src={HackathonLogo}
              alt="TUM Blockchain Hackathon"
              className="h-[70px] sm:h-[86px] w-auto"
            />
            <div className="mt-5 px-4 py-1.5 rounded-full border border-line bg-white/5">
              <Text
                textType={"small"}
                className="text-white font-bold tracking-wide"
              >
                October 30 to 31, 2026
              </Text>
            </div>
            <Text
              textType={"lgsmall"}
              as="p"
              className="text-left text-gray-400 mt-6 max-w-[260px] sm:max-w-[42rem] leading-relaxed"
            >
              Build real solutions alongside the conference at the TUM
              Blockchain Hackathon, open to builders of all levels.
            </Text>
            <div className="mt-auto pt-8">
              <Button buttonType={"cta"} asChild className="w-fit">
                <Link
                  href={HACKATHON_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatsNew;
