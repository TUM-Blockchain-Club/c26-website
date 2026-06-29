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
            <div className="relative max-w-[80vw] xl:max-w-[50vw] min-h-[150px] w-[400px] h-[175px] xs:mt-10 sm:w-[500px] sm:h-[200px] lg:w-[700px] lg:h-[350px]">
              <Image src={confLogo} alt="TUM Blockchain Conference 26" fill />
            </div>

            <div className={"flex flex-col items-center gap-1"}>
              <Text as={"p"} textType={"sub_title"} className="text-center">
                October 29<sup>th</sup> - 31<sup>th</sup> 2026
              </Text>
            </div>
            <div className="flex flex-col items-center gap-1">
              <LumaTicketButton id="luma-ticket-btn-hero">
                Tickets
              </LumaTicketButton>
            </div>
            {/* <div className={"flex flex-col items-center gap-1"}>
              <Text as={"p"} textType={"sub_title"} className="text-center">
                Deutsches Museum, Munich
              </Text>
              <Text as={"p"} textType={"sub_title"} className="text-center">
                September 12<sup>th</sup> - 13<sup>th</sup> 2024
              </Text>
            </div> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
