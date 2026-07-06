import Image from "next/image";
import { Text } from "@/components/text";
import { Button } from "@/components/button";
import { Link } from "@/components/link";
import { HACKATHON_URL } from "@/constants/Links";
import DigitalAssetsDayLogo from "@/public/logos/digital-assets-day-logo.png";
import HackathonLogo from "@/public/logos/hackathon-logo.png";

const WhatsNew = () => {
  return (
    <section className="w-full flex flex-col items-center" id="whats-new">
      <Text textType={"sub_hero"} className="text-gradient text-center">
        What&apos;s New This Year
      </Text>
      <div className="w-full flex justify-center mt-12">
        <div className="w-full flex flex-col items-center lg:flex-row lg:items-stretch lg:justify-center lg:space-x-4 space-y-4 lg:space-y-0">
          <div className="w-full relative border border-gradient-tbc max-w-[280px] sm:max-w-[30rem] p-6 flex flex-col items-center h-full transition-transform duration-300 hover:-translate-y-1">
            <Image
              src={DigitalAssetsDayLogo}
              alt="Digital Assets Day"
              className="h-[70px] sm:h-[86px] w-auto"
            />
            <Text textType={"small"} className="text-center text-gray-400 mt-3">
              Hosted by Bundesblock, the German Blockchain Association
            </Text>
            <div className="mt-4 px-3 py-1 rounded-full border border-white/20 bg-white/5">
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
              className="text-left text-gray-400 mt-6 max-w-[250px] sm:max-w-[42rem]"
            >
              Blockchain is transforming the architecture of the financial
              sector, and digital assets are set to dominate the transfer of new
              forms of money, certificates, identities, and industry data.
              Bundesblock is joining forces with TUM Blockchain Club to explore
              how the financial sector and traditional industries across Germany
              and Europe will be reshaped.
            </Text>
            <div className="mt-auto pt-8">
              <Button disabled buttonType={"cta"} className="w-fit">
                Learn More
              </Button>
            </div>
          </div>
          <div className="w-full relative border border-gradient-tbc max-w-[280px] sm:max-w-[30rem] p-6 flex flex-col items-center h-full transition-transform duration-300 hover:-translate-y-1">
            <Image
              src={HackathonLogo}
              alt="TUM Blockchain Hackathon"
              className="h-[70px] sm:h-[86px] w-auto"
            />
            <Text textType={"small"} className="text-center text-gray-400 mt-3">
              Hosted by TUM Blockchain Club
            </Text>
            <div className="mt-4 px-3 py-1 rounded-full border border-white/20 bg-white/5">
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
              className="text-left text-gray-400 mt-6 max-w-[250px] sm:max-w-[42rem]"
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
