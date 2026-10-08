"use client";

import { Text } from "@/components/text";
import { VenueImage } from "@/components/venue/VenueImage";
import { useEffect, useRef, useState } from "react";

/** How to reach Friedenstraße 24, per the venue's own arrival guidance. */
const GETTING_THERE = [
  {
    label: "Public transport",
    text: "S-Bahn (every line) or U5 to Ostbahnhof, exit Friedenstraße / Werksviertel, then about 500 metres on foot.",
  },
  {
    label: "From the airport",
    text: "The S8 runs to Ostbahnhof around the clock, roughly 35 minutes.",
  },
];

const SLIDES = [
  {
    src: "/venue26/hoc-conference-25-atrium.jpg",
    alt: "The atrium of the House of Communication during the TUM Blockchain Conference 25",
  },
  {
    src: "/venue26/hoc-atrium.jpg",
    alt: "The atrium of the House of Communication",
  },
  {
    src: "/venue26/hoc-floors.jpg",
    alt: "The House of Communication seen across its upper floors",
  },
  {
    src: "/venue26/hoc-courtyard.jpg",
    alt: "The courtyard between the two wings of the House of Communication",
  },
  {
    src: "/venue26/hoc-walkway.jpg",
    alt: "The lit ceiling over the central walkway of the House of Communication",
  },
];

const SLIDE_MS = 4000;

const Venue = () => {
  const [slide, setSlide] = useState(0);
  const timerRef = useRef<HTMLDivElement>(null);

  // The transform follows the state instead of the timer writing it onto the
  // node: the old version started at slide 1 and wrapped back to 1, so the
  // first photo was shown once and then never again.
  useEffect(() => {
    const interval = setInterval(
      () => setSlide((current) => (current + 1) % SLIDES.length),
      SLIDE_MS,
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    timerRef.current?.classList.add("line-anim");
  }, []);

  return (
    <section className="w-full flex flex-col items-center gap-4" id="venue">
      <Text as="p" textType="small" className="eyebrow-tbc text-center">
        Where it happens
      </Text>
      <Text textType={"sub_hero"} className="text-gradient text-center">
        Venue
      </Text>
      <Text
        as="p"
        textType="small"
        className="text-secondary max-w-2xl text-center mt-2"
      >
        The House of Communication in the Werksviertel, where the conference was
        held last year too.
      </Text>

      <div className="mt-8">
        {/* Venue slideshow */}
        <div className="overflow-x-hidden w-[280px] sm:w-[600px] xl:w-[800px]">
          <div
            className="flex relative transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${slide * 100}%)` }}
          >
            {SLIDES.map((image) => (
              <VenueImage
                key={image.src}
                imageSrc={image.src}
                imageAlt={image.alt}
              />
            ))}
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
          {/* Overlaps the photo from the small breakpoint up; on a phone the
              card would sit on top of the photographer's credit, so there it
              stays below the image. */}
          <div className="relative mt-4 bg-black mx-auto border-gradient-tbc border-2 text-center max-w-[280px] sm:max-w-[400px] py-4 sm:py-8 sm:mt-0 sm:-translate-y-[50%]">
            <Text as="p" textType={"sub_title"}>
              House of Communication
            </Text>
            <Text as="p" textType={"paragraph"}>
              Friedenstraße 24, 81671 Munich
            </Text>
          </div>
        </a>
      </div>

      {/* The house's own photographs carry an attribution requirement. It
          used to be burnt into the pixels; crediting it here keeps the images
          clean and the credit intact. */}
      {/* The address card is pulled up over the photo and leaves its own
          height behind as empty space, so claim it back on the credit line. */}
      <Text
        as="p"
        textType="small"
        className="text-faint text-center sm:-mt-16"
      >
        First photo from the TUM Blockchain Conference 25. Venue photographs ©
        Serviceplan Group.
      </Text>

      <div className="grid w-full max-w-2xl gap-3 px-2 sm:grid-cols-2 sm:gap-4">
        {GETTING_THERE.map((fact) => (
          <div key={fact.label} className="card-tbc-soft p-5 text-left">
            <Text
              as="p"
              textType="small"
              className="uppercase tracking-wide text-faint"
            >
              {fact.label}
            </Text>
            <Text as="p" textType="small" className="mt-2 text-secondary">
              {fact.text}
            </Text>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Venue;
