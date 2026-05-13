"use client";

import { Button } from "@/components/button";
import { Link } from "@/components/link";
import { Text } from "@/components/text";
import { Cross1Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import classNames from "classnames";
import Image from "next/image";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

type HeaderElement = React.ElementRef<"header">;
export type HeaderProps = React.ComponentPropsWithoutRef<"header"> & {
  logoUrl?: string;
};

type HeaderLink = {
  label: string;
  link: string;
  showsAtHome: boolean;
};

const links: HeaderLink[] = [
  { label: "Home", link: "/", showsAtHome: true },
  // { label: "Manifesto", link: "/#manifesto", showsAtHome: true },
  { label: "Speakers", link: "/speakers", showsAtHome: true },
  { label: "Sponsors", link: "/sponsors", showsAtHome: true },
  { label: "Academic Forum", link: "/academic-forum", showsAtHome: true },
  // {
  //   label: "Apply as Speaker",
  //   link: "https://tally.so/r/w8EB0o",
  //   showsAtHome: true,
  // },
  { label: "Side Events", link: "/side-events", showsAtHome: true },
  { label: "Agenda", link: "/agenda", showsAtHome: true },
  { label: "Workshops", link: "/workshops", showsAtHome: true },
  // { label: "Student Grants", link: "#grants", showsAtHome: true },
  // { label: "FAQ", link: "#faq", showsAtHome: true },
];

export type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathName = usePathname();

  return (
    <div
      className={classNames(
        "fixed inset-0 z-[9999] transition-transform transform",
        {
          "translate-x-0": isOpen,
          "translate-x-full": !isOpen,
        },
      )}
    >
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-72 bg-black p-6 shadow-lg">
        <div className="mb-8 flex items-center justify-between">
          <Text asChild>
            <span className="font-semibold">Menu</span>
          </Text>
          <button onClick={onClose} aria-label="Close menu">
            <Cross1Icon height={22} width={22} />
          </button>
        </div>

        <nav className="flex flex-col gap-6">
          {links.map((link) => (
            <Text asChild key={link.label}>
              <Link href={link.link}>{link.label}</Link>
            </Text>
          ))}

          <Button buttonType="primary" asChild className="mt-2">
            <Link href="https://www.tum-blockchain.com">
              Visit Club Website
            </Link>
          </Button>
        </nav>
      </div>
    </div>
  );
};

const PRIORITY: string[] = [
  "Home",
  // "Manifesto",
  "Speakers",
  "Sponsors",
  "Academic Forum",
  "Side Events",
  "Agenda",
  "Workshops",
  // "Apply as Speaker",
];

function NavDesktop({ items }: { items: HeaderLink[] }) {
  // ensure deterministic order by priority
  const ordered = useMemo(
    () =>
      [...items].sort(
        (a, b) => PRIORITY.indexOf(a.label) - PRIORITY.indexOf(b.label),
      ),
    [items],
  );

  const top5 = ordered.slice(0, 5);
  const restAfter5 = ordered.slice(5);
  const top7 = ordered.slice(0, 7);
  const restAfter7 = ordered.slice(7);

  return (
    <div
      className={`
        hidden md:flex h-full items-center justify-center
        gap-4 lg:gap-6 xl:gap-8
        min-w-0
      `}
    >
      <div className="md:flex lg:hidden items-center gap-4 min-w-0">
        {top5.map((l) => (
          <Text asChild key={`md-${l.label}`}>
            <Link href={l.link} className="truncate">
              {l.label}
            </Link>
          </Text>
        ))}
        {!!restAfter5.length && <MoreMenu items={restAfter5} />}
      </div>

      <div className="hidden lg:flex xl:hidden items-center gap-6 min-w-0">
        {top7.map((l) => (
          <Text asChild key={`lg-${l.label}`}>
            <Link href={l.link} className="truncate">
              {l.label}
            </Link>
          </Text>
        ))}
        {!!restAfter7.length && <MoreMenu items={restAfter7} />}
      </div>

      {/* XL layout: all inline */}
      <div className="hidden xl:flex items-center gap-8 min-w-0">
        {ordered.map((l) => (
          <Text asChild key={`xl-${l.label}`}>
            <Link href={l.link} className="truncate">
              {l.label}
            </Link>
          </Text>
        ))}
      </div>
    </div>
  );
}

function MoreMenu({ items }: { items: HeaderLink[] }) {
  return (
    <details className="relative group">
      <summary className="cursor-pointer list-none select-none">
        <span>More</span>
      </summary>
      <div
        className={`
          absolute right-0 mt-2 min-w-52 rounded-xl border border-white/10
          bg-black/90 p-2 backdrop-blur-xl shadow-2xl
        `}
      >
        <ul className="py-1">
          {items.map((l) => (
            <li key={l.label}>
              <Text asChild>
                <Link
                  href={l.link}
                  className="block rounded-lg px-3 py-2 hover:bg-white/5 whitespace-nowrap"
                >
                  {l.label}
                </Link>
              </Text>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}

export const Header = React.forwardRef<HeaderElement, HeaderProps>(
  (props, ref) => {
    const { className, logoUrl, ...propRest } = props;
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleSidebarClose = () => setIsSidebarOpen(false);
    const pathName = usePathname();

    useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 100);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
      <>
        <header
          {...propRest}
          className={classNames(
            className,
            "fixed z-[9999] w-full py-3 md:py-4 flex justify-center items-center px-4 md:px-8 lg:px-12 xl:px-20 transition-all duration-300",
            {
              "dark:bg-black/50 backdrop-blur-md": isScrolled,
              "bg-transparent": !isScrolled,
            },
          )}
          ref={ref}
        >
          <div className="max-w-7xl w-full flex justify-between items-center gap-4">
            <div className="w-10 md:w-12 lg:w-16 shrink-0">
              <NextLink href="/">
                <Image
                  src={logoUrl || "/logos/c24-sticker-1.png"}
                  alt="TUM Blockchain Conference sticker logo"
                  className="transition-all duration-300"
                  width={isScrolled ? 44 : 56}
                  height={isScrolled ? 44 : 56}
                  priority
                />
              </NextLink>
            </div>

            <div className="hidden md:flex items-center gap-3 lg:gap-8">
              <NavDesktop items={links} />
              <Button asChild className="whitespace-nowrap md:px-3 lg:px-4 ">
                <Link href="https://www.tum-blockchain.com">
                  Visit Club Website
                </Link>
              </Button>
            </div>

            <div className="md:hidden py-2 px-2 -mr-2">
              <button
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Open menu"
                className="p-2"
              >
                <HamburgerMenuIcon height={24} width={24} />
              </button>
            </div>
          </div>
        </header>

        <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      </>
    );
  },
);
Header.displayName = "Header";
