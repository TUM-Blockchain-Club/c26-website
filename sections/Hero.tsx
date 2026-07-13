"use client";

import { Text } from "@/components/text";
import Image from "next/image";
import confLogo from "@/public/logos/c26-wordmark.svg";
import { LumaTicketButton } from "@/components/luma-ticket-button";

const Hero = () => {
  return (
    <>
      <section className="relative mt-[50vh] translate-y-[-50%] w-full flex justify-center items-center overflow-visible">
        <div>
          <div className="flex flex-col w-full justify-between items-center gap-8">
            <Text
              as="p"
              textType="small"
              className="eyebrow-tbc text-center text-xs md:text-sm"
            >
              Hosted by TUM Blockchain Club
            </Text>

            <div className="relative max-w-[80vw] xl:max-w-[50vw] min-h-[150px] w-[400px] h-[175px] xs:mt-2 sm:w-[500px] sm:h-[200px] lg:w-[700px] lg:h-[320px]">
              <Image
                src={confLogo}
                alt="TUM Blockchain Conference 26"
                fill
                className="object-contain"
              />
            </div>

            <div className="flex flex-wrap justify-center items-center gap-3">
              <div className="rounded-full border border-line bg-white/5 px-4 py-1.5 backdrop-blur-sm">
                <Text as="p" textType="lgsmall" className="font-bold">
                  October 29&ndash;31, 2026
                </Text>
              </div>
              <div className="rounded-full border border-line bg-white/5 px-4 py-1.5 backdrop-blur-sm">
                <Text as="p" textType="lgsmall" className="font-bold">
                  House of Communication, Munich
                </Text>
              </div>
            </div>

            <div className="flex max-w-xl flex-col items-center gap-5 text-center">
              <Text
                as="p"
                textType="paragraph"
                className="max-w-md text-secondary"
              >
                Secure your spot for Germany&apos;s leading student-run
                blockchain conference.
              </Text>
              <LumaTicketButton
                id="luma-ticket-btn-hero"
                className="px-8 py-4 text-base font-black uppercase tracking-[0.06em] shadow-[0_0_24px_rgb(var(--color-text-rgb)/0.18)] md:px-10 md:py-5 md:text-lg"
              >
                Buy Tickets
              </LumaTicketButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
