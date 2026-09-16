import Image from "next/image";
import { Link } from "@/components/link";
import { LogoBackground } from "@/util/logoTone";

export type MarqueeLogo = {
  name: string;
  src: string;
  website?: string;
  /** Light logos would vanish on the white card, so they get a dark one. */
  background?: LogoBackground;
};

const SIZE = {
  large: "h-16 w-32 xs:h-20 xs:w-40 md:h-24 md:w-52",
  small: "h-14 w-28 xs:h-16 xs:w-32 md:h-20 md:w-44",
} as const;

export type LogoMarqueeProps = {
  logos: MarqueeLogo[];
  size?: keyof typeof SIZE;
  reverse?: boolean;
  /** One full loop, e.g. "60s". Longer list, longer duration. */
  speed?: string;
};

/**
 * A row of logo cards sliding past, used for both the current sponsors at the
 * top of the page and the past ones further down.
 */
export const LogoMarquee = ({
  logos,
  size = "large",
  reverse,
  speed = "60s",
}: LogoMarqueeProps) => {
  if (logos.length === 0) return null;

  // 4 copies, animated by -50% (= 2 full sets), so the loop stays seamless
  // and the strip always exceeds the container width at any window size.
  const repeated = [...logos, ...logos, ...logos, ...logos];
  const animationName = reverse ? "logo-marquee-reverse" : "logo-marquee";

  return (
    <div className="relative w-full overflow-hidden py-2">
      <style>{`
        @keyframes logo-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @keyframes logo-marquee-reverse {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-black to-transparent md:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-black to-transparent md:w-28" />
      <div
        className="flex w-max gap-3 md:gap-4"
        style={{ animation: `${animationName} ${speed} linear infinite` }}
      >
        {repeated.map((logo, index) => {
          const card = `sponsor-carousel-card flex shrink-0 items-center justify-center rounded-md border border-line px-5 transition hover:border-line-strong ${
            SIZE[size]
          } ${logo.background === "dark" ? "bg-white/[0.06]" : "bg-white"}`;
          const image = (
            <Image
              src={logo.src}
              alt={logo.name}
              width={260}
              height={130}
              className="max-h-[70%] w-auto max-w-[85%] object-contain"
            />
          );

          return logo.website ? (
            <Link
              key={`${logo.name}-${index}`}
              href={logo.website}
              target="_blank"
              rel="noopener noreferrer"
              className={card}
            >
              {image}
            </Link>
          ) : (
            <div key={`${logo.name}-${index}`} className={card}>
              {image}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LogoMarquee;
