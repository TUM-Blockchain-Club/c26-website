"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import classNames from "classnames";
import { MapPin } from "lucide-react";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Text } from "@/components/text";
import { AgendaSpeakers } from "@/components/agenda/AgendaSpeakers";
import { SessionShare } from "@/components/agenda/SessionShare";
import {
  EVENT_BADGES,
  dayLabel,
  isShareable,
  sessionPath,
  sessionTime,
  trackStyle,
} from "@/components/agenda/sessionMeta";
import { type AgendaTalk } from "@/constants/digitalAssetsDayAgenda";
import { useHasTalk, useTalkById } from "@/components/agenda/AgendaData";

/**
 * Opens a session of the agenda in a dialog that holds everything about it
 * on one screen: day, time, stage, title, speakers and sharing.
 *
 * The open session lives in the address bar so the back button closes the
 * dialog and the link can be copied straight from it. On /agenda that is the
 * session's own page, /agenda/<id>, which renders the agenda with the dialog
 * already open. The day pages keep their own path and add ?session=<id>
 * instead, so a reload stays on the day page.
 */
type UrlMode = "path" | "query";

const SessionDialogContext = createContext<((id: string) => void) | null>(null);

const PATH_PATTERN = /^\/agenda\/([^/]+)\/?$/;

/** The session the current URL points at, if it is one we have. The id is
 * returned decoded, which is how every other caller spells it. */
const idInUrl = (mode: UrlMode, hasTalk: (id: string) => boolean) => {
  const raw =
    mode === "path"
      ? window.location.pathname.match(PATH_PATTERN)?.[1]
      : new URLSearchParams(window.location.search).get("session");
  if (!raw) return undefined;
  const id = decodeURIComponent(raw);
  return hasTalk(id) ? id : undefined;
};

const urlWith = (mode: UrlMode, id: string | undefined) => {
  if (mode === "path") return id ? sessionPath(id) : "/agenda";
  const url = new URL(window.location.href);
  if (id) url.searchParams.set("session", id);
  else url.searchParams.delete("session");
  return `${url.pathname}${url.search}`;
};

export const SessionDialogProvider = ({
  children,
  urlMode,
  initialSessionId,
}: {
  children: React.ReactNode;
  urlMode: UrlMode;
  /** The session to open on load, when the page is that session's own. */
  initialSessionId?: string;
}) => {
  const [openId, setOpenId] = useState(initialSessionId);
  const hasTalk = useHasTalk();
  // Whether the open dialog added its own history entry. Closing it then
  // steps back, so the back button afterwards leaves the page as expected
  // instead of reopening the session.
  const pushed = useRef(false);

  useEffect(() => {
    const sync = () => {
      const id = idInUrl(urlMode, hasTalk);
      if (!id) pushed.current = false;
      setOpenId(id);
    };
    // The day pages are static, so a ?session= deep link is only read here.
    if (urlMode === "query") sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
    // hasTalk is derived from the programme, which does not change while the
    // page is open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlMode]);

  const open = useCallback(
    (id: string) => {
      setOpenId(id);
      window.history.pushState(null, "", urlWith(urlMode, id));
      pushed.current = true;
      window.plausible?.("Session Open", { props: { session: id } });
    },
    [urlMode],
  );

  const close = useCallback(() => {
    setOpenId(undefined);
    if (pushed.current) {
      pushed.current = false;
      window.history.back();
    } else {
      window.history.replaceState(null, "", urlWith(urlMode, undefined));
    }
  }, [urlMode]);

  const talk = useTalkById(openId);

  return (
    <SessionDialogContext.Provider value={open}>
      {children}
      <Dialog.Root
        open={!!talk}
        onOpenChange={(isOpen) => {
          if (!isOpen) close();
        }}
      >
        {talk && <SessionDialogContent talk={talk} />}
      </Dialog.Root>
    </SessionDialogContext.Provider>
  );
};

/**
 * The session's title as a link to its own page, stretched over the whole
 * card so the card opens the dialog wherever it is clicked. It stays a real
 * link: a modified click opens the session page in a new tab, and crawlers
 * find every session page through it.
 */
export const SessionTrigger = ({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const open = useContext(SessionDialogContext);
  return (
    <a
      href={sessionPath(id)}
      onClick={(e) => {
        if (!open || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        open(id);
      }}
      className={classNames(
        "after:absolute after:inset-0 after:rounded-lg after:content-[''] focus-visible:outline-none",
        className,
      )}
    >
      {children}
    </a>
  );
};

/** Card classes that go with a SessionTrigger inside: the positioning the
 * stretched link needs, a hover tint and a focus ring for keyboard users. */
export const clickableCard =
  "relative cursor-pointer transition-colors hover:bg-white/[0.05] has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-focus";

const SessionDialogContent = ({ talk }: { talk: AgendaTalk }) => {
  const badge = EVENT_BADGES[talk.event];
  const track = talk.track ? trackStyle(talk.track) : undefined;

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="session-overlay fixed inset-0 z-[10000] bg-black/75 backdrop-blur-sm" />
      <Dialog.Content
        // Most sessions carry no abstract; those without one are named by
        // their title alone. With one, Dialog.Description below wires it up.
        {...(talk.description ? {} : { "aria-describedby": undefined })}
        // Focus the sheet itself rather than its first button, so opening it
        // with a tap does not light up the close button's focus ring.
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          (e.currentTarget as HTMLElement | null)?.focus();
        }}
        className={classNames(
          // A block, not a flex column: a column would squeeze the clamped
          // abstract to nothing whenever the sheet hits its height cap.
          "session-sheet fixed z-[10001] block overflow-y-auto overscroll-contain border border-line-strong bg-black shadow-2xl focus:outline-none",
          // Phone: a sheet along the bottom edge, never taller than the part
          // of the screen the browser leaves visible.
          "inset-x-0 bottom-0 max-h-[100dvh] rounded-t-2xl border-b-0 pb-[max(1rem,env(safe-area-inset-bottom))] pl-6 pr-5 pt-4",
          // Wider screens: centred.
          "sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:max-h-[calc(100dvh-3rem)] sm:w-[min(46rem,calc(100vw-3rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg sm:border-b sm:py-6 sm:pl-9 sm:pr-8",
        )}
      >
        {/* The track's colour, or the event's where there is no track, as
            the same left edge the agenda cards carry. */}
        <span
          aria-hidden
          className={classNames(
            "absolute inset-y-0 left-0 w-1",
            track ? track.dot : badge.edge,
          )}
        />

        <Dialog.Close
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full p-1.5 text-secondary transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:right-5 sm:top-5"
        >
          <Cross2Icon className="h-5 w-5" />
        </Dialog.Close>

        <div className="flex items-start pr-10">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            <span
              className={classNames(
                "rounded-full border px-2.5 py-0.5 text-xs font-bold",
                badge.className,
              )}
            >
              {badge.label}
            </span>
            {talk.format && (
              <span className="rounded-full border border-line px-2.5 py-0.5 text-xs text-secondary">
                {talk.format}
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-1.5 sm:mt-4 sm:gap-2">
          <Text as="p" textType="lgsmall" className="font-bold text-white">
            <span className="sm:hidden">{dayLabel(talk.day, "short")}</span>
            <span className="hidden sm:inline">
              {dayLabel(talk.day)}
            </span> · {sessionTime(talk)}
          </Text>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {/* Where to go is what people look for first once they are in
                the building, so the stage reads as loudly as the time. */}
            {talk.stage && (
              <span className="flex items-center gap-1.5">
                <MapPin
                  className={classNames("h-4 w-4 shrink-0", badge.text)}
                  aria-hidden
                />
                <Text
                  as="span"
                  textType="lgsmall"
                  className="font-bold text-white sm:!text-base"
                >
                  {talk.stage}
                </Text>
              </span>
            )}
            {track && talk.track && (
              <span className="flex items-center gap-1.5">
                <span
                  className={classNames("h-2 w-2 rounded-full", track.dot)}
                  aria-hidden
                />
                <Text as="span" textType="small" className="text-secondary">
                  {talk.track}
                </Text>
              </span>
            )}
          </div>
        </div>

        <Dialog.Title asChild>
          <h2
            className={classNames(
              "mt-2.5 text-balance font-sans text-[17px] font-bold leading-snug sm:mt-4 sm:text-2xl",
              !talk.title && "italic text-muted",
            )}
          >
            {talk.title ?? "Title to be announced"}
          </h2>
        </Dialog.Title>

        {/* Plain text from Strapi; line breaks typed in the admin are kept. */}
        {talk.description && (
          <Dialog.Description asChild>
            <Text
              as="p"
              textType="paragraph"
              className="mt-3 whitespace-pre-line leading-relaxed text-secondary sm:mt-4"
            >
              {talk.description}
            </Text>
          </Dialog.Description>
        )}

        <div className="mt-5 sm:mt-7">
          <AgendaSpeakers
            speakers={talk.speakers}
            moderator={talk.moderator}
            size="compact"
          />
        </div>

        {isShareable(talk) && (
          <div className="mt-4 border-t border-line pt-3.5 sm:mt-6 sm:pt-5">
            <SessionShare talk={talk} />
          </div>
        )}
      </Dialog.Content>
    </Dialog.Portal>
  );
};
