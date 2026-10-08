"use client";

import { Link } from "@/components/link";
import { Text } from "@/components/text";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  ChevronDownIcon,
  Cross1Icon,
  HamburgerMenuIcon,
} from "@radix-ui/react-icons";
import classNames from "classnames";
import Image from "next/image";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { HACKATHON_URL } from "@/constants/Links";
import { LumaTicketButton } from "@/components/luma-ticket-button/LumaTicketButton";

type HeaderElement = React.ElementRef<"header">;
export type HeaderProps = React.ComponentPropsWithoutRef<"header"> & {
  logoUrl?: string;
};

type HeaderLink = {
  label: string;
  link: string;
};

/**
 * The navigation, grouped. It used to be one flat row of nine links that the
 * breakpoints had to truncate into a "More" menu; with a page per conference
 * day that row stopped fitting anywhere. Everything about the programme now
 * sits under one heading, everything about partnering under another, which
 * leaves four things to read across the top instead of nine.
 *
 * A group with no children is a plain link.
 */
type NavGroup = {
  label: string;
  link?: string;
  children?: HeaderLink[];
};

const nav: NavGroup[] = [
  { label: "Home", link: "/" },
  {
    label: "Programme",
    children: [
      { label: "Full Agenda", link: "/agenda" },
      { label: "TUM Blockchain Conference Day", link: "/conference-day" },
      { label: "Digital Assets Day", link: "/digital-assets-day" },
      { label: "Hackathon", link: HACKATHON_URL },
      { label: "Side Events", link: "/side-events" },
    ],
  },
  { label: "Speakers", link: "/speakers" },
  {
    label: "Partners",
    children: [
      { label: "Our Sponsors", link: "/sponsors" },
      { label: "Become a Partner", link: "/#become-a-partner" },
    ],
  },
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

        <nav className="flex flex-col gap-6 overflow-y-auto pb-6">
          {nav.map((group) =>
            group.children ? (
              <div key={group.label} className="flex flex-col gap-3">
                <Text
                  as="p"
                  textType="small"
                  className="uppercase tracking-widest text-muted"
                >
                  {group.label}
                </Text>
                <div className="flex flex-col gap-3 border-l border-line pl-4">
                  {group.children.map((child) => (
                    <Text asChild key={child.label}>
                      <Link href={child.link} onClick={onClose}>
                        {child.label}
                      </Link>
                    </Text>
                  ))}
                </div>
              </div>
            ) : (
              <Text asChild key={group.label}>
                <Link href={group.link ?? "/"} onClick={onClose}>
                  {group.label}
                </Link>
              </Text>
            ),
          )}

          <LumaTicketButton
            id="luma-ticket-btn-sidebar"
            className="mt-2 w-full"
          >
            Get Your Ticket
          </LumaTicketButton>
          <Text asChild>
            <Link href="https://www.tum-blockchain.com" onClick={onClose}>
              Visit Club Website
            </Link>
          </Text>
        </nav>
      </div>
    </div>
  );
};

/** One group in the top bar: a link, or a label that opens its children. */
function NavItem({ group }: { group: NavGroup }) {
  if (!group.children) {
    return (
      <Text asChild>
        <Link href={group.link ?? "/"} className="whitespace-nowrap">
          {group.label}
        </Link>
      </Text>
    );
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 whitespace-nowrap outline-none transition-colors hover:text-white data-[state=open]:text-white"
        >
          <Text as="span">{group.label}</Text>
          <ChevronDownIcon
            className="transition-transform duration-200 group-data-[state=open]:rotate-180"
            aria-hidden
          />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={14}
          align="start"
          className="z-[10000] min-w-56 rounded-xl border border-line-subtle bg-black/90 p-2 shadow-2xl backdrop-blur-xl"
        >
          {group.children.map((child) => (
            <DropdownMenu.Item key={child.label} asChild>
              <Link
                href={child.link}
                className="block cursor-pointer rounded-lg px-3 py-2 whitespace-nowrap outline-none hover:bg-white/5 focus:bg-white/5"
              >
                <Text as="span">{child.label}</Text>
              </Link>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function NavDesktop() {
  return (
    <nav className="hidden min-w-0 items-center gap-5 md:flex lg:gap-8">
      {nav.map((group) => (
        <NavItem key={group.label} group={group} />
      ))}
    </nav>
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
      // Read the scroll position inside a frame instead of on every scroll
      // event, and only re-render when the threshold is actually crossed.
      let queued = false;
      const handleScroll = () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
          queued = false;
          setIsScrolled(window.scrollY > 100);
        });
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
      <>
        <header
          {...propRest}
          className={classNames(
            className,
            // pr-2 on phones rather than px-4: the burger used to be pulled out
            // of the row with -mr-2 to sit flush, which made the row eight
            // pixels wider than its own box on every page. Same place, inside
            // the box.
            "fixed z-[9999] w-full py-3 md:py-4 flex justify-center items-center pl-4 pr-2 md:px-8 lg:px-12 xl:px-20",
          )}
          ref={ref}
        >
          {/* The scrolled look lives on its own layer and fades in and out.
              It used to be classes on the header itself, so crossing the
              threshold transitioned background-color and border-bottom-color
              and changed the blur radius, none of which the compositor can
              take over: a short fast scroll past 100px put the page through
              300ms of style recalculation and repainting, which is exactly
              where it felt stuck. Opacity is composited, and the blur is
              declared once and never changes. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 border-b border-white/5 bg-black/50 transition-opacity duration-300"
            style={{
              opacity: isScrolled ? 1 : 0,
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          />
          <div className="relative max-w-7xl w-full flex justify-between items-center gap-4">
            <div className="w-10 md:w-12 lg:w-16 shrink-0">
              <NextLink href="/">
                <Image
                  src={logoUrl || "/logos/c24-sticker-1.png"}
                  alt="TUM Blockchain Conference sticker logo"
                  className={classNames(
                    "origin-left transition-transform duration-300",
                    isScrolled ? "scale-[0.79]" : "scale-100",
                  )}
                  width={56}
                  height={56}
                  priority
                />
              </NextLink>
            </div>

            {/* The bar is fixed, so this is the one call to action that
                follows the reader through every page, the agenda and the
                speaker list included. It used to point at the club's website,
                which is now in the footer instead. */}
            <div className="hidden md:flex items-center gap-3 lg:gap-8">
              <NavDesktop />
              <LumaTicketButton
                id="luma-ticket-btn-header"
                className="whitespace-nowrap md:px-3 lg:px-4"
              >
                Get Your Ticket
              </LumaTicketButton>
            </div>

            <div className="flex items-center gap-1 md:hidden">
              <LumaTicketButton
                id="luma-ticket-btn-header-mobile"
                className="whitespace-nowrap !px-3 !py-2 !text-sm"
              >
                Ticket
              </LumaTicketButton>
              <div className="py-2 px-2">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  aria-label="Open menu"
                  className="p-2"
                >
                  <HamburgerMenuIcon height={24} width={24} />
                </button>
              </div>
            </div>
          </div>
        </header>

        <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      </>
    );
  },
);
Header.displayName = "Header";
