import { galleryImages } from "@/constants/mediaPortal";

/**
 * Impressions from last year's edition as a two-row film strip: press
 * photos drifting in opposite directions (marquee CSS in globals.css,
 * hover pauses, reduced-motion safe). Real faces and full rooms — the
 * strongest social proof the homepage can show.
 */
const LastYearGallery = () => {
  const firstRow = galleryImages.slice(0, 6);
  const secondRow = galleryImages.slice(6);

  const Row = ({
    images,
    reverse = false,
  }: {
    images: typeof galleryImages;
    reverse?: boolean;
  }) => (
    <div className="marquee marquee-no-pause w-full">
      <div
        className={`marquee-track ${reverse ? "marquee-track-reverse" : ""}`}
      >
        {[false, true].map((hidden) => (
          <div
            key={hidden ? "copy" : "original"}
            className="flex gap-4 pr-4"
            aria-hidden={hidden || undefined}
          >
            {images.map((img) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={img.id}
                src={img.web}
                alt="Impression from TUM Blockchain Conference 25"
                loading="eager"
                decoding="async"
                className="h-44 w-auto shrink-0 rounded-xl border border-line object-cover md:h-56"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="flex w-full flex-col gap-4">
      <Row images={firstRow} />
      <Row images={secondRow} reverse />
    </section>
  );
};

export default LastYearGallery;
