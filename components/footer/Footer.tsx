import { Link } from "@/components/link";
import { NewsletterSignup } from "@/components/newsletter";
import { Text } from "@/components/text";
import confLogo from "@/public/logos/c26-wordmark.svg";
import dcLogo from "@/public/logos/discord-logo.png";
import liLogo from "@/public/logos/linkedin-logo.png";
import tbcLogo from "@/public/logos/tbc-wordmark.svg";
import xLogo from "@/public/logos/x-logo.png";
import lineBg from "@/public/logos/lines.svg";
import classNames from "classnames";
import Image from "next/image";
import React from "react";

type FooterElement = React.ElementRef<"footer">;
export type FooterProps = React.ComponentPropsWithoutRef<"footer">;

const socials = [
  {
    href: "https://discord.gg/7V7KG8SESF",
    alt: "Discord",
    logo: dcLogo,
  },
  {
    href: "https://www.linkedin.com/company/tum-blockchain-club/",
    alt: "LinkedIn",
    logo: liLogo,
  },
  {
    href: "https://x.com/tbc_munich",
    alt: "X",
    logo: xLogo,
  },
];

const links = [
  { href: "mailto:relations@tum-blockchain.com", label: "Contact" },
  { href: "/privacy-policy.pdf", label: "Privacy Policy" },
  { href: "https://www.tum-blockchain.com/imprint", label: "Imprint" },
  { href: "/partners", label: "Partners" },
];

export const Footer = React.forwardRef<FooterElement, FooterProps>(
  (props, ref) => {
    const { className, ...restProps } = props;
    return (
      <footer
        {...restProps}
        id={"footer"}
        className={classNames(
          className,
          "relative z-10 flex justify-center bg-gradient-to-b from-black from-10% to-[rgb(var(--color-background-rgb)/0.66)] to-80%",
        )}
        ref={ref}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 h-full w-full">
          <Image
            src={lineBg}
            alt=""
            aria-hidden
            fill
            style={{ objectFit: "cover", opacity: 0.2 }}
          />
        </div>

        <div className="relative z-20 flex w-full max-w-7xl flex-col px-6 pb-8 pt-16 md:px-12 lg:px-24">
          {/* Top: brand block left, newsletter + links right */}
          <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-16">
            <div className="flex flex-col items-start gap-5">
              <Image
                src={confLogo}
                alt={"TUM Blockchain Conference Logo"}
                height={88}
              />
              <div className="flex flex-col gap-2">
                <Text textType={"small"} className="text-muted">
                  Organized by
                </Text>
                <Image
                  src={tbcLogo}
                  alt={"TUM Blockchain Club Logo"}
                  width={145}
                />
              </div>
              <div className="mt-1 flex gap-4">
                {socials.map((s) => (
                  <Link
                    key={s.alt}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-70 transition-opacity hover:opacity-100"
                  >
                    <Image src={s.logo} alt={s.alt} width={25} />
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-10 md:flex-row md:gap-20">
              <NewsletterSignup />
              <nav aria-label="Footer" className="flex flex-col gap-3">
                <span className="font-sans text-sm font-semibold uppercase text-white">
                  Links
                </span>
                {links.map((l) => (
                  <Text key={l.label} asChild textType="lgsmall">
                    <Link
                      href={l.href}
                      className="whitespace-nowrap text-secondary transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </Text>
                ))}
              </nav>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
            <Text textType="small" className="text-faint">
              © 2026 TUM Blockchain Club
            </Text>
            <Text textType="small" className="text-faint">
              TUM Blockchain Conference 26 · October 29–31 · Munich
            </Text>
          </div>
        </div>
      </footer>
    );
  },
);
Footer.displayName = "Footer";
