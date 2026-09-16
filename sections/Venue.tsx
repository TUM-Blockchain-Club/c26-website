"use client";

import { Text } from "@/components/text";
import { VenueImage } from "@/components/venue/VenueImage";
import { useEffect, useRef, useState } from "react";

const Venue = () => {
  const [slide, setSlide] = useState(1);
  const slideRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (slideRef.current !== null && timerRef.current !== null) {
      const slideCount = slideRef.current.children.length;
      timerRef.current.classList.add("line-anim");
      interval = setInterval(() => {
        slideRef.current!.style.transform = `translateX(-${100 * slide}%)`;
        setSlide((slide + 1) % slideCount);
      }, 4000);
    }

    return () => {
      if (interval != null) {
        clearInterval(interval);
      }
    };
  }, [slide]);

  return (
    <section className="w-full flex flex-col items-center gap-4" id="venue">
      <Text as="p" textType="small" className="eyebrow-tbc text-center">
        Where it happens
      </Text>
      <Text textType={"sub_hero"} className="text-gradient text-center">
        Venue
      </Text>

      <div className="mt-8">
        {/* Venue slideshow */}
        <div className="overflow-x-hidden w-[280px] sm:w-[600px] xl:w-[800px]">
          <div
            className="flex relative duration-500 ease-in-out"
            ref={slideRef}
          >
            <VenueImage
              imageSrc={"/venue/venue_1.png"}
              imageAlt="House of Communication"
            />
            <VenueImage
              imageSrc={"/venue/venue_2.png"}
              imageAlt="House of Communication"
            />
            <VenueImage
              imageSrc={"/venue/venue_3.png"}
              imageAlt="House of Communication"
            />
            <VenueImage
              imageSrc={"/venue/venue_4.png"}
              imageAlt="House of Communication"
            />
            <VenueImage
              imageSrc={"/venue/venue_5.png"}
              imageAlt="House of Communication"
            />
          </div>
          <div
            id="line-anim"
            className="w-full h-[2px] bg-gradient-tbc"
            ref={timerRef}
          ></div>
        </div>

        <a
          href="https://maps.app.goo.gl/rLirPeQoSCjxYL1u5"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div className="relative -translate-y-[50%] bg-black mx-auto border-gradient-tbc border-2 text-center max-w-[250px] sm:max-w-[400px] py-4 sm:py-8">
            <Text as="p" textType={"sub_title"}>
              House of Communication
            </Text>
            <Text as="p" textType={"paragraph"}>
              Friedenstraße 24, 81671 Munich
            </Text>
          </div>
        </a>
      </div>
    </section>
  );
};

export default Venue;
