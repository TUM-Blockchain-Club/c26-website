"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { StagePerson, StageSlot } from "@/components/stage/stageData";
import { playIntroSting } from "@/components/stage/introSound";
import { DeckPage, RemotePage, openRemote } from "@/components/stage/DeckPage";
import {
  OPENING_CSS,
  OPENING_IMAGES,
  OPENING_SESSION,
  OPENING_SLIDES,
  OpeningSlide,
  type OpeningSlideId,
} from "@/components/stage/OpeningDeck";
import {
  listDecks,
  onDecksChanged,
  type DeckMeta,
} from "@/components/stage/decks";

/**
 * A full-screen display for one stage, run on the stage computer and cued by
 * the crew, the way conference AV teams run their graphics: nothing moves on
 * its own, every step is one press of → (or a presentation clicker).
 *
 * Each session is a short run of cues:
 *
 *   Up next → Intro (ring, music) → On stage → Slides 1…n
 *
 * "On stage" holds the speakers' photos, names and title while they walk
 * up. If a PDF was uploaded for the session on the studio page, its pages
 * follow, one per press; without one, "On stage" simply stays up as the
 * fallback (or the crew switches to the speaker's laptop on the video
 * switcher). Breaks in the
 * programme are a cue of their own. P puts up a short-pause screen at any
 * moment and takes it down again; B blacks the screen out.
 *
 * Where the crew is is kept per stage in this browser, so a reload resumes
 * at the same cue. A starts from the cue that fits the current time.
 *
 * `?at=2026-10-29T09:20` sets the clock for rehearsal, `&speed=20` runs it
 * faster; it only affects the clock and countdowns, never the cues.
 */

const INTRO_MS = 8200;
/** How long a scene takes to fade out when the next one comes. */
const LEAVE_MS = 350;
const COUNTDOWN_FROM_MS = 30 * 60 * 1000;
const REFRESH_MS = 60 * 1000;

const BRAND = {
  conference: {
    a: "#ffc110",
    b: "#f44336",
    c: "#6f3de2",
    glowA: "rgba(255,193,16,0.22)",
    glowB: "rgba(111,61,226,0.30)",
    accent: "#ffc110",
    label: "TUM Blockchain Conference",
  },
  "digital-assets-day": {
    a: "#9cc2ff",
    b: "#4a7dff",
    c: "#2a3fd6",
    glowA: "rgba(120,170,255,0.22)",
    glowB: "rgba(42,63,214,0.34)",
    accent: "#8fb4ff",
    label: "Digital Assets Day",
  },
  hackathon: {
    a: "#ffc110",
    b: "#f44336",
    c: "#6f3de2",
    glowA: "rgba(244,67,54,0.22)",
    glowB: "rgba(111,61,226,0.30)",
    accent: "#ff6a4d",
    label: "Hackathon",
  },
} as const;

const pad = (n: number) => String(n).padStart(2, "0");

/** "09:10 to 09:25": the screens use no dashes or dots as separators. */
const range = (slot: StageSlot) => `${slot.startLabel} to ${slot.endLabel}`;

/** A title as the programme writes it may carry " - " or " — " between a
 * headline and its subline; on screen that becomes two lines, not a dash. */
const titleParts = (title: string) =>
  title
    .split(/\s+[-–—]\s+/)
    .map((t) => t.trim())
    .filter(Boolean);

const TitleLines = ({ title }: { title: string }) => {
  const parts = titleParts(title);
  return (
    <>
      {parts.map((part, i) => (
        <span key={i} className="stg-tl">
          {part}
        </span>
      ))}
    </>
  );
};
/** Munich wall clock for an instant; the conference runs on CET (+01:00). */
const munich = (ms: number) => {
  const d = new Date(ms + 60 * 60 * 1000);
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
};

/** Rooms whose LED wall is wider than 16:9, by its resolution. Their screen
 * is laid out in a frame of that shape, centred, with black above and below
 * when the computer sends a taller picture, so nothing falls off the edge.
 * Hopper is a plain 1920 x 1080 and needs no entry. */
/** On the Digital Assets Day the panel sits in front of the wall, so the
 * lower part of each screen stays empty: the share of the height kept free,
 * per room. The logo grows, the stage and clock move to the top centre and
 * the speakers to the top right, above the chairs. */
const FLOOR_FREE: Record<string, number> = {
  nakamoto: 0.4,
  turing: 0.2,
  hopper: 0.2,
};

/** Rooms where a speaker's slides sit as a card on the right, over the
 * screen's background, with the session beside them, rather than filling
 * the screen on black. */
const FRAMED_DECK = new Set(["nakamoto"]);

/** Rooms that always put the speakers in their own column on the right,
 * with stage and clock at the top centre; every room with a free floor
 * does too. */
const SIDE_ROOMS = new Set(["nakamoto"]);

const WIDE_ROOMS: Record<string, [number, number]> = {
  nakamoto: [2880, 1026],
  turing: [3840, 1152],
};

type CueKind = "upnext" | "intro" | "onstage" | "deck" | "break";
/** Where a slide cue comes from: the studio PDF on this computer, or a
 * file uploaded on the session in Strapi. */
type DeckRef =
  | { from: "local"; page: number }
  | { from: "opening"; slide: OpeningSlideId; page: number }
  | { from: "strapi"; src: string; kind: "pdf" | "image"; page: number };
type Cue = {
  kind: CueKind;
  slot: StageSlot;
  key: string;
  page?: number;
  deck?: DeckRef;
  pages?: number;
};

const CUE_LABEL: Record<CueKind, string> = {
  upnext: "Up next",
  intro: "Intro",
  onstage: "On stage",
  deck: "Slides",
  break: "Break",
};

/** The day as a run of cues, in programme order. */
const buildCues = (
  slots: StageSlot[],
  decks: Map<string, DeckMeta>,
  pdfPages: Map<string, number>,
): Cue[] =>
  slots.flatMap((slot): Cue[] => {
    if (slot.kind === "break")
      return [{ kind: "break", slot, key: `${slot.id}:break` }];
    // A PDF uploaded in the studio on this computer wins; otherwise the
    // files uploaded on the session in Strapi, in their order.
    const local = decks.get(slot.id)?.pages ?? 0;
    const refs: DeckRef[] = local
      ? Array.from({ length: local }, (_, i) => ({
          from: "local" as const,
          page: i + 1,
        }))
      : (slot.slides ?? []).flatMap((f): DeckRef[] =>
          f.kind === "image"
            ? [{ from: "strapi", src: f.src, kind: "image", page: 1 }]
            : Array.from({ length: pdfPages.get(f.src) ?? 0 }, (_, i) => ({
                from: "strapi" as const,
                src: f.src,
                kind: "pdf" as const,
                page: i + 1,
              })),
        );
    // The opening ceremony brings its own slides when nothing was uploaded.
    if (!refs.length && slot.id === OPENING_SESSION)
      refs.push(
        ...OPENING_SLIDES.map((slide, i) => ({
          from: "opening" as const,
          slide,
          page: i + 1,
        })),
      );
    return [
      { kind: "upnext", slot, key: `${slot.id}:upnext` },
      { kind: "intro", slot, key: `${slot.id}:intro` },
      { kind: "onstage", slot, key: `${slot.id}:onstage` },
      ...refs.map((deck, i) => ({
        kind: "deck" as const,
        slot,
        page: i + 1,
        pages: refs.length,
        deck,
        key: `${slot.id}:deck:${i + 1}`,
      })),
    ];
  });

/** The cue that fits a moment: the next session's "Up next", or the running
 * session's "On stage". */
const cueForTime = (cues: Cue[], now: number) => {
  const running = cues.findIndex(
    (c) =>
      (c.kind === "onstage" || c.kind === "break") &&
      c.slot.start <= now &&
      now < c.slot.end,
  );
  if (running >= 0) return running;
  const upcoming = cues.findIndex(
    (c) => (c.kind === "upnext" || c.kind === "break") && c.slot.start > now,
  );
  return upcoming >= 0 ? upcoming : Math.max(cues.length - 1, 0);
};

/** Munich calendar day of an instant ("2026-10-30"). */
const dayOf = (ms: number) =>
  new Date(ms + 60 * 60 * 1000).toISOString().slice(0, 10);

const DAY_NAMES: Record<string, string> = {
  "2026-10-29": "Thursday, 29 October",
  "2026-10-30": "Friday, 30 October",
  "2026-10-31": "Saturday, 31 October",
};

type Saved = {
  key: string | null;
  pause: boolean;
  black: boolean;
  /** The day this screen runs, or null for the whole programme. The day
   * also sets the branding: the Digital Assets Day is blue throughout. */
  day: string | null;
  /** Set once the crew has confirmed stage and day on the start screen. */
  started: boolean;
};

const readSaved = (storageKey: string): Saved => {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (raw) {
      const s = JSON.parse(raw) as Partial<Saved>;
      return {
        key: typeof s.key === "string" ? s.key : null,
        pause: !!s.pause,
        black: !!s.black,
        day: typeof s.day === "string" ? s.day : null,
        started: !!s.started,
      };
    }
  } catch {
    // Private window or blocked storage: start fresh.
  }
  return {
    key: null,
    pause: false,
    black: false,
    day: null,
    started: false,
  };
};

const writeSaved = (storageKey: string, saved: Saved) => {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(saved));
  } catch {
    // Not fatal: the screen just forgets the cue on reload.
  }
};

/** The clock the screen shows: real time, or a rehearsal time. */
const useStageClock = () => {
  const params = useSearchParams();
  const at = params.get("at");
  const speed = Math.max(1, Number(params.get("speed")) || 1);
  const origin = useMemo(() => {
    const base = at ? Date.parse(`${at}:00+01:00`) : NaN;
    return { base: Number.isNaN(base) ? null : base, real: Date.now() };
  }, [at]);
  const read = useCallback(
    () =>
      origin.base === null
        ? Date.now()
        : origin.base + (Date.now() - origin.real) * speed,
    [origin, speed],
  );
  const [now, setNow] = useState(read);
  useEffect(() => {
    const id = window.setInterval(() => setNow(read()), 250);
    return () => window.clearInterval(id);
  }, [read]);
  return { now, rehearsal: origin.base !== null, speed };
};

export const StageDisplay = ({
  roomSlug,
  room,
  rooms,
  slots,
}: {
  roomSlug: string;
  room: string;
  rooms: { slug: string; room: string; dad: string }[];
  slots: StageSlot[];
}) => {
  const router = useRouter();
  const { now, rehearsal, speed } = useStageClock();
  const storageKey = `c26-stage-cue-${roomSlug}`;
  const [decks, setDecks] = useState<Map<string, DeckMeta>>(new Map());
  useEffect(() => {
    const load = () =>
      void listDecks().then((all) =>
        setDecks(new Map(all.map((d) => [d.sessionId, d]))),
      );
    load();
    return onDecksChanged(load);
  }, []);
  const [mounted, setMounted] = useState(false);
  const [saved, setSavedState] = useState<Saved>({
    key: null,
    pause: false,
    black: false,
    day: null,
    started: false,
  });
  // The days this stage has sessions on, each with the event that runs it.
  const days = useMemo(() => {
    const map = new Map<string, StageSlot["event"]>();
    for (const sl of slots) {
      const d = dayOf(sl.start);
      if (!map.has(d) || sl.event === "digital-assets-day")
        map.set(d, sl.event);
    }
    return [...map].map(([day, event]) => ({ day, event }));
  }, [slots]);
  const daySlots = useMemo(
    () =>
      saved.day ? slots.filter((sl) => dayOf(sl.start) === saved.day) : slots,
    [slots, saved.day],
  );
  // Page counts of the Strapi PDFs for the chosen day, read once each.
  const [pdfPages, setPdfPages] = useState<Map<string, number>>(new Map());
  useEffect(() => {
    let cancelled = false;
    const srcs = [
      ...new Set(
        daySlots.flatMap((sl) =>
          (sl.slides ?? []).filter((f) => f.kind === "pdf").map((f) => f.src),
        ),
      ),
    ];
    void Promise.all(
      srcs.map(
        async (src) => [src, (await openRemote(src))?.numPages ?? 0] as const,
      ),
    ).then((pairs) => {
      if (!cancelled) setPdfPages(new Map(pairs));
    });
    return () => {
      cancelled = true;
    };
  }, [daySlots]);
  const cues = useMemo(
    () => buildCues(daySlots, decks, pdfPages),
    [daySlots, decks, pdfPages],
  );
  const [introRun, setIntroRun] = useState(0);
  const startedRef = useRef(false);
  const [panel, setPanel] = useState(false);
  const panelTimer = useRef<number | undefined>(undefined);

  const params = useSearchParams();
  const startCue = params.get("cue");
  const startDay = params.get("day");
  useEffect(() => {
    const stored = readSaved(storageKey);
    // ?day=2026-10-30 comes from the start page: that day, set up and running.
    const restored =
      startDay && startDay !== stored.day
        ? { ...stored, day: startDay, key: null, started: true }
        : startDay
          ? { ...stored, started: true }
          : stored;
    // ?cue=<session>:<step> opens the screen on that cue, e.g. from the
    // studio's preview link.
    setSavedState(
      startCue
        ? {
            ...restored,
            key: startCue,
            pause: false,
            black: false,
            started: true,
          }
        : restored,
    );
    setMounted(true);
  }, [storageKey, startCue, startDay]);
  const save = useCallback(
    (update: (s: Saved) => Saved) =>
      setSavedState((s) => {
        const next = update(s);
        writeSaved(storageKey, next);
        return next;
      }),
    [storageKey],
  );

  // Fresh programme from Strapi every minute. The cue is kept by its key, so
  // an edit to a title or a speaker updates the screen without moving it.
  useEffect(() => {
    const id = window.setInterval(() => router.refresh(), REFRESH_MS);
    return () => window.clearInterval(id);
  }, [router]);

  const index = useMemo(() => {
    const i = saved.key ? cues.findIndex((c) => c.key === saved.key) : -1;
    return i >= 0 ? i : cueForTime(cues, now);
    // The time only picks the starting cue; afterwards only the crew moves it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cues, saved.key]);
  const cue = cues[index] as Cue | undefined;
  startedRef.current = saved.started;

  // ------------------------------------------------------------ sound
  const [soundOn, setSoundOn] = useState(false);
  const audio = useRef<AudioContext | null>(null);
  const soundKey = `c26-stage-sound-${roomSlug}`;
  useEffect(() => {
    try {
      setSoundOn(window.localStorage.getItem(soundKey) === "on");
    } catch {
      // Storage blocked: sound stays off.
    }
  }, [soundKey]);
  // Browsers only allow audio after a press or click; the context is made
  // on the first one, before any cue reacts to it (capture phase).
  const ensureAudio = useCallback(() => {
    if (!audio.current) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (Ctx) audio.current = new Ctx();
    }
    if (audio.current?.state === "suspended") void audio.current.resume();
    return audio.current;
  }, []);
  useEffect(() => {
    window.addEventListener("pointerdown", ensureAudio, true);
    window.addEventListener("keydown", ensureAudio, true);
    return () => {
      window.removeEventListener("pointerdown", ensureAudio, true);
      window.removeEventListener("keydown", ensureAudio, true);
    };
  }, [ensureAudio]);
  const stopSting = useRef<(() => void) | null>(null);
  const playSting = useCallback(() => {
    const ctx = ensureAudio();
    if (!ctx) return;
    const go = () => {
      stopSting.current?.();
      stopSting.current = playIntroSting(ctx);
    };
    if (ctx.state === "running") go();
    else void ctx.resume().then(go);
  }, [ensureAudio]);
  const introOn = useRef(false);
  const toggleSound = useCallback(() => {
    const next = !soundOn;
    setSoundOn(next);
    try {
      window.localStorage.setItem(soundKey, next ? "on" : "off");
    } catch {
      // Not fatal.
    }
    // Takes effect at once: on during an intro starts the cue, off stops it.
    if (!next) {
      stopSting.current?.();
      stopSting.current = null;
    } else if (introOn.current) playSting();
  }, [soundOn, soundKey, playSting]);

  // The intro plays when the crew cues it, and again on I.
  const cueKey = cue?.key;
  const playIntro = useCallback(() => {
    setIntroRun((n) => n + 1);
    if (soundOn) playSting();
  }, [soundOn, playSting]);
  const lastCue = useRef<string | undefined>(undefined);
  // A layout effect, so the intro starts before the browser paints the new
  // cue; with a plain effect "On stage" flashed for one frame first.
  useLayoutEffect(() => {
    if (!mounted) return;
    if (
      cue?.kind === "intro" &&
      lastCue.current !== cueKey &&
      lastCue.current !== undefined
    ) {
      playIntro();
    }
    lastCue.current = cueKey;
  }, [cueKey, cue?.kind, mounted, playIntro]);
  // Once the intro has run, hand over to "On stage" by itself.
  // The timer depends only on which intro is running: data that reloads
  // meanwhile (slide page counts, the minute refresh) used to restart it, so
  // the intro sometimes never handed over.
  const handOver = useRef(() => {});
  useLayoutEffect(() => {
    handOver.current = () => {
      const next = cues[index + 1];
      if (next) save((s) => ({ ...s, key: next.key }));
    };
  });
  const introCue = cue?.kind === "intro" ? cue.key : null;
  useEffect(() => {
    if (!introCue || introRun === 0) return;
    const id = window.setTimeout(() => handOver.current(), INTRO_MS);
    return () => window.clearTimeout(id);
  }, [introRun, introCue]);

  // ---------------------------------------------------------- controls
  const go = useCallback(
    (dir: 1 | -1) => {
      if (!cues.length) return;
      const i = Math.min(Math.max(index + dir, 0), cues.length - 1);
      save((s) => ({ ...s, key: cues[i].key, pause: false, black: false }));
    },
    [cues, index, save],
  );
  const jumpSession = useCallback(
    (dir: 1 | -1) => {
      if (!cue) return;
      const from = cues.findIndex((c) => c.slot.id === cue.slot.id);
      let i = from;
      do i += dir;
      while (
        i > 0 &&
        i < cues.length - 1 &&
        cues[i].kind !== "upnext" &&
        cues[i].kind !== "break"
      );
      i = Math.min(Math.max(i, 0), cues.length - 1);
      save((s) => ({ ...s, key: cues[i].key, pause: false, black: false }));
    },
    [cue, cues, save],
  );
  const toNow = useCallback(
    () =>
      save((s) => ({
        ...s,
        key: cues[cueForTime(cues, now)]?.key ?? null,
        pause: false,
        black: false,
      })),
    [cues, now, save],
  );
  const togglePause = useCallback(
    () => save((s) => ({ ...s, pause: !s.pause, black: false })),
    [save],
  );
  const toggleBlack = useCallback(
    () => save((s) => ({ ...s, black: !s.black })),
    [save],
  );
  const fullscreen = useCallback(() => {
    const el = document.documentElement;
    if (document.fullscreenElement) void document.exitFullscreen?.();
    else void el.requestFullscreen?.().catch(() => undefined);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key;
      if (!startedRef.current) return;
      if (
        k === "ArrowRight" ||
        k === "PageDown" ||
        k === " " ||
        k === "Enter"
      ) {
        e.preventDefault();
        go(1);
      } else if (k === "ArrowLeft" || k === "PageUp") {
        e.preventDefault();
        go(-1);
      } else if (k === "ArrowDown") {
        e.preventDefault();
        jumpSession(1);
      } else if (k === "ArrowUp") {
        e.preventDefault();
        jumpSession(-1);
      } else if (k === "p" || k === "P") togglePause();
      else if (k === "b" || k === "B" || k === ".") toggleBlack();
      else if (k === "a" || k === "A") toNow();
      else if (k === "i" || k === "I") playIntro();
      else if (k === "m" || k === "M") toggleSound();
      else if (k === "f" || k === "F") fullscreen();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    go,
    jumpSession,
    togglePause,
    toggleBlack,
    toNow,
    playIntro,
    toggleSound,
    fullscreen,
    save,
  ]);

  const showPanel = useCallback(() => {
    setPanel(true);
    window.clearTimeout(panelTimer.current);
    panelTimer.current = window.setTimeout(() => setPanel(false), 4000);
  }, []);

  // Every picture of the chosen day is fetched up front, so photos and logos
  // are in the cache before their cue comes up.
  const preloaded = useRef<HTMLImageElement[]>([]);
  useEffect(() => {
    const srcs = new Set<string>([
      "/logos/c26-wordmark-no-hackathon.svg",
      "/logos/digital-assets-day-logo.png",
    ]);
    if (daySlots.some((sl) => sl.id === OPENING_SESSION))
      for (const src of OPENING_IMAGES) srcs.add(src);
    for (const sl of daySlots) {
      for (const p of sl.people) if (p.photo) srcs.add(p.photo);
      for (const sp of sl.trackSponsors ?? []) srcs.add(sp.src);
      for (const sp of sl.sponsors ?? []) srcs.add(sp.src);
      for (const f of sl.slides ?? []) if (f.kind === "image") srcs.add(f.src);
    }
    preloaded.current = [...srcs].map((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
      return img;
    });
  }, [daySlots]);

  // Pictures fade in where they belong once loaded, instead of popping in.
  const rootRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    rootRef.current
      ?.querySelectorAll<HTMLImageElement>("img:not([data-ready])")
      .forEach((img) => {
        const ready = () => (img.dataset.ready = "1");
        if (img.complete && img.naturalWidth) ready();
        else {
          img.addEventListener("load", ready, { once: true });
          img.addEventListener("error", ready, { once: true });
        }
      });
  });

  // Long titles and big panels: shrink the title and portraits step by step
  // until everything fits above the ticker, never below 60 percent.
  const mainRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    // Measured as the scene will stand once its entrance is over: the rise
    // offsets are zeroed for the measurement (and back before paint), and
    // only the incoming scene counts, not one still fading out. Otherwise a
    // scene shrinks while it rises in and jumps back a moment later.
    const scene =
      [...el.children].find(
        (c): c is HTMLElement =>
          c instanceof HTMLElement && !c.classList.contains("is-leaving"),
      ) ?? el;
    el.style.setProperty("--rise", "0");
    let fit = 1;
    el.style.setProperty("--fit", "1");
    while (scene.scrollHeight > scene.clientHeight + 1 && fit > 0.6) {
      fit = Math.round((fit - 0.05) * 100) / 100;
      el.style.setProperty("--fit", String(fit));
    }
    el.style.removeProperty("--rise");
  });

  if (!mounted) return <div className="fixed inset-0 bg-[#050407]" />;

  const slot = cue?.slot;
  const dayEvent = days.find((d) => d.day === saved.day)?.event;
  const event = dayEvent ?? slot?.event ?? "conference";
  const brand = BRAND[event];
  const nextTalk = (from: number) =>
    cues.slice(from + 1).find((c) => c.kind === "upnext")?.slot;
  const upcoming = nextTalk(index);
  const nextCue = cues[index + 1];
  const introActive = cue?.kind === "intro" && introRun > 0;
  const floor =
    event === "digital-assets-day" ? (FLOOR_FREE[roomSlug] ?? 0) : 0;

  introOn.current = introActive;

  return (
    <div
      ref={rootRef}
      className={`stg-root ${introActive ? "is-intro" : ""} ${
        WIDE_ROOMS[roomSlug] ? "is-wide" : ""
      } ${floor ? "is-floor" : ""} ${
        floor || SIDE_ROOMS.has(roomSlug) ? "is-side" : ""
      } ${FRAMED_DECK.has(roomSlug) ? "is-framed-deck" : ""}`}
      data-brand={event}
      onMouseMove={showPanel}
      style={
        {
          "--a": brand.a,
          "--b": brand.b,
          "--c": brand.c,
          "--glowA": brand.glowA,
          "--glowB": brand.glowB,
          "--acc": brand.accent,
          ...(floor && { "--floor": floor }),
          ...(WIDE_ROOMS[roomSlug] && {
            "--r": WIDE_ROOMS[roomSlug][0] / WIDE_ROOMS[roomSlug][1],
          }),
        } as React.CSSProperties
      }
    >
      <style>{CSS}</style>
      <Backdrop dad={event === "digital-assets-day"} />

      <header className="stg-top">
        <div className="stg-brand">
          {event === "digital-assets-day" ? (
            // The Digital Assets Day runs under its own mark alone.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/logos/digital-assets-day-logo.png"
              alt="Digital Assets Day by Bundesblock"
              className="stg-dad stg-dad-solo"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/logos/c26-wordmark-no-hackathon.svg"
              alt="TUM Blockchain Conference 26"
              className="stg-wordmark"
            />
          )}
        </div>
        <div className="stg-where">
          <span className="stg-stage">{slot?.stage ?? room}</span>
          <span className="stg-sep" aria-hidden />
          <span className="stg-clock">{munich(now)}</span>
        </div>
      </header>

      <main className="stg-main" ref={mainRef}>
        <SceneFader
          sceneKey={
            !cue
              ? "wrap"
              : cue.kind === "onstage" || (cue.kind === "intro" && !introActive)
                ? `on-${cue.slot.id}`
                : cue.kind === "upnext" ||
                    cue.kind === "break" ||
                    cue.deck?.from === "opening"
                  ? cue.key
                  : cue.kind === "deck" && FRAMED_DECK.has(roomSlug)
                    ? `deck-${cue.slot.id}`
                    : "none"
          }
        >
          {!cue && <Wrap key="wrap" />}
          {cue?.kind === "upnext" && (
            <UpNext
              key={cue.key}
              slot={cue.slot}
              after={nextTalk(index + 3)}
              now={now}
            />
          )}
          {(cue?.kind === "onstage" ||
            (cue?.kind === "intro" && !introActive)) && (
            <NowOnStage
              key={cue.slot.id}
              slot={cue.slot}
              next={upcoming}
              now={now}
              manual
            />
          )}
          {cue?.kind === "break" && (
            <Break key={cue.key} slot={cue.slot} next={upcoming} now={now} />
          )}
          {cue?.kind === "deck" &&
            cue.deck?.from !== "opening" &&
            FRAMED_DECK.has(roomSlug) && (
              <DeckSide key={`deck-${cue.slot.id}`} slot={cue.slot} />
            )}
          {cue?.deck?.from === "opening" && (
            <OpeningSlide
              key={cue.key}
              id={cue.deck.slide}
              sponsors={cue.slot.sponsors ?? []}
            />
          )}
        </SceneFader>
      </main>

      {cue?.kind === "deck" && cue.deck?.from === "local" && (
        <DeckPage
          key={`${cue.slot.id}-${decks.get(cue.slot.id)?.updatedAt}`}
          sessionId={cue.slot.id}
          page={cue.deck.page}
          version={decks.get(cue.slot.id)?.updatedAt ?? 0}
        />
      )}
      {cue?.kind === "deck" && cue.deck?.from === "strapi" && (
        <RemotePage
          // One canvas per file: the next page is drawn off screen and
          // swapped in, so the old page stays until the new one is ready.
          key={cue.deck.src}
          src={cue.deck.src}
          kind={cue.deck.kind}
          page={cue.deck.page}
        />
      )}

      {introActive && cue && (
        <Intro
          key={`i-${cue.key}-${introRun}`}
          slot={cue.slot}
          label={brand.label}
          dad={event === "digital-assets-day"}
          stage={cue.slot.stage}
        />
      )}

      {saved.pause && <Pause next={upcoming ?? slot} />}
      {saved.black && <div className="stg-black" />}

      {!saved.started && (
        <div className="stg-start" onMouseMove={(e) => e.stopPropagation()}>
          <span className="stg-label">
            <i aria-hidden />
            Stage screen setup
          </span>
          <h1 className="stg-title">Which stage and day?</h1>
          <div className="stg-start-group">
            <span className="stg-start-caption">Stage</span>
            <div className="stg-start-options">
              {rooms.map((r) => (
                <a
                  key={r.slug}
                  href={`/stage-76803f8f95/${r.slug}`}
                  className={r.slug === roomSlug ? "is-on" : undefined}
                >
                  <strong>{r.room}</strong>
                  <small>{r.dad} on the Digital Assets Day</small>
                </a>
              ))}
            </div>
          </div>
          <div className="stg-start-group">
            <span className="stg-start-caption">Day</span>
            <div className="stg-start-options">
              {days.map((d) => (
                <button
                  key={d.day}
                  type="button"
                  data-dad={d.event === "digital-assets-day" || undefined}
                  className={saved.day === d.day ? "is-on" : undefined}
                  onClick={() => save((s) => ({ ...s, day: d.day, key: null }))}
                >
                  <strong>{DAY_NAMES[d.day] ?? d.day}</strong>
                  <small>{BRAND[d.event].label}</small>
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            className="stg-start-go"
            disabled={!saved.day}
            onClick={() => {
              save((s) => ({ ...s, started: true }));
              void document.documentElement
                .requestFullscreen?.()
                .catch(() => undefined);
            }}
          >
            Start in full screen
          </button>
        </div>
      )}

      <div className={`stg-panel ${panel ? "is-open" : ""}`}>
        <span className="stg-panel-state">
          {cue ? CUE_LABEL[cue.kind] : "End"}
          {cue?.kind === "deck" && ` ${cue.page} of ${cue.pages ?? "?"}`}
          {nextCue && <span>Next {CUE_LABEL[nextCue.kind]}</span>}
          {saved.pause && <span>Pause</span>}
          <span>Sound {soundOn ? "on" : "off"}</span>
          {rehearsal && <span>Rehearsal{speed > 1 ? ` x${speed}` : ""}</span>}
        </span>
        <button type="button" onClick={() => go(-1)}>
          ◀ Back
        </button>
        <button type="button" onClick={() => go(1)}>
          Next ▶
        </button>
        <button type="button" onClick={() => jumpSession(-1)}>
          ⏮ Session
        </button>
        <button type="button" onClick={() => jumpSession(1)}>
          Session ⏭
        </button>
        <button type="button" onClick={togglePause}>
          {saved.pause ? "End pause" : "Pause"}
        </button>
        <button type="button" onClick={toggleBlack}>
          {saved.black ? "Show" : "Black"}
        </button>
        <button type="button" onClick={playIntro}>
          Replay intro
        </button>
        <button type="button" onClick={toNow}>
          Jump to now
        </button>
        <button type="button" onClick={toggleSound}>
          {soundOn ? "Sound off" : "Sound on"}
        </button>
        <button
          type="button"
          onClick={() => save((s) => ({ ...s, started: false }))}
        >
          Setup
        </button>
        <button type="button" onClick={fullscreen}>
          Full screen
        </button>
      </div>

      {!panel && nextCue && (
        <span className="stg-badge">
          Then {CUE_LABEL[nextCue.kind]}
          {nextCue.slot.id !== slot?.id ? ` at ${nextCue.slot.startLabel}` : ""}
        </span>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ parts */

/** Large orbits behind the content: [cx, cy, r, seconds per lap, start
 * offset, accent]. Each carries a short arc of light that travels slowly
 * along it, over a barely visible full circle. */
const ORBITS: [number, number, number, number, number, boolean][] = [
  [1560, 980, 620, 70, 0, false],
  [1560, 980, 820, 96, 31, true],
  [1560, 980, 1040, 124, 64, false],
  [260, -160, 520, 88, 12, false],
  [260, -160, 760, 112, 47, true],
];

/** The conference ring, scaled down from the 3264 px hero artwork: the full
 * size cost a long first decode on stage laptops. The soft copy is only ever
 * shown blurred, so a small file is enough. */
const RING = "/stage/ring.png";
const RING_SOFT = "/stage/ring-soft.png";

const Backdrop = ({ dad }: { dad: boolean }) => (
  <div className="stg-bg" aria-hidden>
    {/* The conference ring: as designed on the conference days; on the
        Digital Assets Day its own light and shade, toned in several blues. */}
    {/* During the intro this ring moves to the middle, grows and softens,
        then returns. Only transform and opacity change, so it runs on the
        graphics card; the soft copy is blurred once, not per frame. */}
    <div className={`stg-ring ${dad ? "is-dad" : ""}`}>
      <div className="stg-ring-spin">
        {dad ? (
          <>
            {["", " stg-ring-soft"].map((soft) => (
              <div key={soft} className={`stg-ring-art${soft}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={soft ? RING_SOFT : RING} alt="" />
                <i />
              </div>
            ))}
          </>
        ) : (
          <>
            {/* The conference ring as designed: yellow, red and purple. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={RING} alt="" className="stg-ring-art" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={RING_SOFT}
              alt=""
              className="stg-ring-art stg-ring-soft"
            />
          </>
        )}
      </div>
    </div>
    <svg
      className="stg-orbits"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
    >
      {ORBITS.map(([cx, cy, r, sec, off, acc], i) => {
        const len = 2 * Math.PI * r;
        return (
          <g key={i} className={acc ? "is-acc" : undefined}>
            <circle cx={cx} cy={cy} r={r} className="stg-orbit-track" />
            <circle
              cx={cx}
              cy={cy}
              r={r}
              className="stg-orbit-light"
              style={
                {
                  strokeDasharray: `${len * 0.32} ${len * 0.68}`,
                  "--len": `${len}px`,
                  animationDuration: `${sec}s`,
                  animationDelay: `-${off}s`,
                } as React.CSSProperties
              }
            />
          </g>
        );
      })}
    </svg>
  </div>
);

const Portrait = ({ p }: { p: StagePerson }) => (
  <span className="stg-portrait">
    {p.photo ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={p.photo} alt="" />
    ) : (
      <svg viewBox="0 0 40 40" aria-hidden>
        <rect width="40" height="40" fill="#16151b" />
        <circle cx="20" cy="16" r="7" fill="#2c2a33" />
        <path d="M6 42c2-9 7.5-13.5 14-13.5S32 33 34 42Z" fill="#2c2a33" />
      </svg>
    )}
  </span>
);

/** Speakers first, then the moderator, each with their role. */
const People = ({
  people,
  layout,
}: {
  people: StagePerson[];
  layout?: "auto" | "strip";
}) => {
  if (!people.length) return null;
  const n = people.length;
  const mode =
    layout === "strip" ? "strip" : n === 1 ? "solo" : n <= 3 ? "row" : "strip";
  return (
    <ul className={`stg-people is-${mode}`} data-n={n}>
      {people.map((p, i) => (
        <li
          key={p.name}
          className={p.moderator ? "is-mod" : undefined}
          style={{ animationDelay: `${0.75 + i * 0.12}s` }}
        >
          <Portrait p={p} />
          <span className="stg-person-text">
            <span className="stg-name">{p.name}</span>
            {p.position && <span className="stg-role">{p.position}</span>}
            {p.company && <span className="stg-company">{p.company}</span>}
            {p.moderator && <span className="stg-tag">Moderator</span>}
          </span>
        </li>
      ))}
    </ul>
  );
};

const countdown = (ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(s / 60);
  return m >= 60
    ? `${Math.floor(m / 60)}:${pad(m % 60)} h`
    : `${pad(m)}:${pad(s % 60)}`;
};

const Label = ({
  children,
  live,
}: {
  children: React.ReactNode;
  live?: boolean;
}) => (
  <span className={`stg-label ${live ? "is-live" : ""}`}>
    <i aria-hidden />
    {children}
  </span>
);

const Meta = ({ slot }: { slot: StageSlot }) => (
  <span className="stg-meta">
    <span>{slot.timeTba ? "Time TBA" : range(slot)}</span>
    {slot.format && <span>{slot.format}</span>}
  </span>
);

/** The focus track and, where it has them, the sponsors who present it.
 * Their logos sit on plates exactly as supplied, never recoloured. */
const TrackLine = ({
  slot,
  logos = true,
}: {
  slot: StageSlot;
  logos?: boolean;
}) =>
  slot.track && slot.track !== "General Interest" ? (
    <div className="stg-track">
      <span className="stg-track-name">{slot.track} track</span>
      {logos && slot.trackSponsors && slot.trackSponsors.length > 0 && (
        <>
          <span className="stg-track-by">presented by</span>
          <span className="stg-track-logos">
            {slot.trackSponsors.map((sp) => (
              <span
                key={sp.name}
                className={`stg-track-plate ${sp.light ? "is-light" : ""}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={sp.src} alt={sp.name} />
              </span>
            ))}
          </span>
        </>
      )}
    </div>
  ) : null;

const Ticker = ({ label, slot }: { label: string; slot?: StageSlot }) =>
  slot ? (
    <footer className="stg-ticker">
      <span className="stg-ticker-label">{label}</span>
      <span className="stg-ticker-time">{slot.startLabel}</span>
      <span className="stg-ticker-title">
        <TitleLines title={slot.title} />
      </span>
    </footer>
  ) : null;

const titleSize = (slot: StageSlot) =>
  slot.title.length > 70 ? "is-long" : slot.title.length > 38 ? "is-mid" : "";

const SessionScene = ({
  slot,
  label,
  live,
  side,
  ticker,
  sponsors = true,
}: {
  slot: StageSlot;
  label: React.ReactNode;
  live?: boolean;
  side?: React.ReactNode;
  ticker?: React.ReactNode;
  /** Off while the talk runs: the stage belongs to the speakers then. */
  sponsors?: boolean;
}) => {
  const solo = slot.people.length === 1;
  return (
    <section
      className={`stg-scene stg-session ${solo ? "has-solo" : "has-group"}`}
    >
      <div className="stg-head">
        <div className="stg-head-row">
          <Label live={live}>{label}</Label>
          {side}
        </div>
        <Meta slot={slot} />
        <TrackLine slot={slot} logos={sponsors} />
        <h1 className={`stg-title ${titleSize(slot)}`}>
          <TitleLines title={slot.title} />
        </h1>
      </div>
      <People people={slot.people} />
      {ticker}
    </section>
  );
};

/** Beside a speaker's slides on the framed rooms: what is on and who. */
const DeckSide = ({ slot }: { slot: StageSlot }) => {
  const names = slot.people.filter((p) => !p.moderator).map((p) => p.name);
  return (
    <section className="stg-scene stg-deck-side">
      <Label live>On stage</Label>
      <h1 className="stg-title">
        <TitleLines title={slot.title} />
      </h1>
      {names.length > 0 && (
        <p className="stg-deck-people">{names.join(", ")}</p>
      )}
    </section>
  );
};

const UpNext = ({
  slot,
  after,
  now,
}: {
  slot: StageSlot;
  after?: StageSlot;
  now: number;
}) => {
  const left = slot.start - now;
  return (
    <SessionScene
      slot={slot}
      label="Up next"
      side={
        left > 0 && left <= COUNTDOWN_FROM_MS ? (
          <span className="stg-countdown">
            <small>Starts in</small> {countdown(left)}
          </span>
        ) : null
      }
      ticker={<Ticker label="Later" slot={after} />}
    />
  );
};

const NowOnStage = ({
  slot,
  next,
}: {
  slot: StageSlot;
  next?: StageSlot;
  now: number;
  manual: boolean;
}) => (
  <SessionScene
    slot={slot}
    label="On stage"
    live
    sponsors={false}
    ticker={<Ticker label="Next" slot={next} />}
  />
);

const Break = ({
  slot,
  next,
  now,
}: {
  slot: StageSlot;
  next?: StageSlot;
  now: number;
}) => (
  <section className="stg-scene stg-break">
    <div className="stg-break-main">
      <Label>{range(slot)}</Label>
      <h1 className="stg-title stg-huge">{slot.title}</h1>
    </div>
    {next && (
      <div className="stg-break-next">
        <div className="stg-head-row">
          <Label>After the break at {next.startLabel}</Label>
          {next.start - now > 0 && next.start - now <= COUNTDOWN_FROM_MS && (
            <span className="stg-countdown">{countdown(next.start - now)}</span>
          )}
        </div>
        <h2 className="stg-subtitle">
          <TitleLines title={next.title} />
        </h2>
        <People people={next.people} />
      </div>
    )}
  </section>
);

/** Cross-fades the scenes in the middle of the screen: the old one stays
 * mounted and fades out slowly while the new one fades in after it, so
 * nothing pops. The leaving scene keeps its DOM node (same key, placed after
 * the new one), which keeps its animations from restarting. */
const SceneFader = ({
  sceneKey,
  children,
}: {
  sceneKey: string;
  children: React.ReactNode;
}) => {
  const [leaving, setLeaving] = useState<
    { key: string; node: React.ReactNode; at: number }[]
  >([]);
  // The switch is noticed while rendering (not in an effect afterwards), so
  // the old scene is never unmounted, not even for one frame.
  const [shownKey, setShownKey] = useState(sceneKey);
  const [lastNode, setLastNode] = useState<React.ReactNode>(children);
  if (shownKey !== sceneKey) {
    setShownKey(sceneKey);
    setLeaving((l) => [
      ...l.filter((x) => x.key !== shownKey && x.key !== sceneKey),
      ...(shownKey === "none"
        ? []
        : [{ key: shownKey, node: lastNode, at: Date.now() }]),
    ]);
  }
  // Remember the current scene's latest content for when it leaves.
  useLayoutEffect(() => {
    setLastNode(() => children);
  }, [children]);
  useEffect(() => {
    if (!leaving.length) return;
    const id = window.setTimeout(
      () => setLeaving((l) => l.filter((x) => Date.now() - x.at < LEAVE_MS)),
      LEAVE_MS + 50,
    );
    return () => window.clearTimeout(id);
  }, [leaving]);
  // One keyed list, so the scene that starts leaving keeps its DOM node.
  return (
    <>
      {[
        { key: sceneKey, node: children, out: false },
        ...leaving
          .filter((l) => l.key !== sceneKey)
          .map((l) => ({ ...l, out: true })),
      ].map((l) => (
        <div
          key={l.key}
          className={`stg-layer${l.out ? " is-leaving" : ""}`}
          aria-hidden={l.out || undefined}
        >
          {l.node}
        </div>
      ))}
    </>
  );
};

const Wrap = ({ nextDay }: { nextDay?: StageSlot } = {}) => (
  <section className="stg-scene stg-center">
    <Label>Thank you</Label>
    <h1 className="stg-title stg-huge">That’s a wrap for today</h1>
    {nextDay && (
      <p className="stg-lede">
        Back at {nextDay.startLabel} with <TitleLines title={nextDay.title} />
      </p>
    )}
  </section>
);

const Pause = ({ next }: { next?: StageSlot }) => (
  <div className="stg-pause">
    <section className="stg-scene stg-center">
      <Label>Short break</Label>
      <h1 className="stg-title stg-huge">We’ll be right back</h1>
      {next && (
        <p className="stg-lede">
          Next <TitleLines title={next.title} />
        </p>
      )}
    </section>
  </div>
);

/** The day's mark, flown in in 3D: the conference wordmark (without the
 * Hackathon line) or the Digital Assets Day logo, never recoloured. */
const DayMark = ({ dad }: { dad: boolean }) => {
  const src = dad
    ? "/logos/digital-assets-day-logo.png"
    : "/logos/c26-wordmark-no-hackathon.svg";
  const mask = { WebkitMaskImage: `url(${src})`, maskImage: `url(${src})` };
  return (
    <div className="stg-intro-mark" aria-hidden>
      <div className="stg-intro-mark-out">
        <div className={`stg-intro-mark-in ${dad ? "is-dad" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" />
          <span className="stg-intro-shine" style={mask} />
        </div>
        <span className="stg-intro-mark-floor" />
      </div>
    </div>
  );
};

/** Small four-point stars that twinkle around the ring during the intro:
 * x and y in percent of the screen, size in --u, delay in seconds. */
const SPARKLES: [number, number, number, number][] = [
  [18, 22, 1.6, 1.2],
  [31, 74, 1.1, 1.8],
  [72, 18, 1.3, 1.5],
  [84, 66, 1.8, 2.1],
  [62, 84, 0.9, 2.6],
  [12, 52, 0.8, 2.9],
  [90, 34, 0.9, 3.3],
];

const Sparkles = () => (
  <div className="stg-sparkles" aria-hidden>
    {SPARKLES.map(([x, y, size, delay], i) => (
      <svg
        key={i}
        viewBox="-10 -10 20 20"
        style={
          {
            left: `${x}%`,
            top: `${y}%`,
            "--s": size,
            animationDelay: `${delay}s`,
          } as React.CSSProperties
        }
      >
        <path d="M0 -10 Q1.2 -1.2 10 0 Q1.2 1.2 0 10 Q-1.2 1.2 -10 0 Q-1.2 -1.2 0 -10Z" />
      </svg>
    ))}
  </div>
);

const Intro = ({
  slot,
  label,
  dad,
  stage,
}: {
  slot: StageSlot;
  label: string;
  dad: boolean;
  stage: string;
}) => {
  const people = slot.people;
  const solo = people.length === 1;
  return (
    <div className="stg-intro" aria-live="polite">
      {slot.trackSponsors && slot.trackSponsors.length > 0 && (
        <div className="stg-intro-track">
          <TrackLine slot={slot} />
        </div>
      )}
      <Sparkles />
      <DayMark dad={dad} />
      <div className="stg-intro-content">
        <span className="stg-intro-eyebrow">
          <span>{label}</span>
          <span>{stage}</span>
        </span>
        {people.length > 0 && (
          <div className={`stg-intro-faces ${solo ? "is-solo" : ""}`}>
            {people.slice(0, 6).map((p, i) => (
              <figure
                key={p.name}
                style={{ animationDelay: `${3.15 + i * 0.1}s` }}
              >
                <Portrait p={p} />
                <figcaption>
                  {!solo && <span className="stg-intro-cap">{p.name}</span>}
                  {p.moderator && <span className="stg-tag">Moderator</span>}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
        <span className="stg-intro-mask">
          <span className="stg-intro-name">
            {solo ? people[0].name : <TitleLines title={slot.title} />}
          </span>
        </span>
        {solo ? (
          <span className="stg-intro-title">
            <TitleLines title={slot.title} />
          </span>
        ) : (
          slot.format && <span className="stg-intro-title">{slot.format}</span>
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------- css */

const CSS = `
.stg-root{--fw:100vw;--fh:100vh;--u:min(1vw,1.7778vh);--bg:#0a090c;--ink:#f5f3f7;--mute:rgba(245,243,247,.8);--line:rgba(245,243,247,.14);position:fixed;inset:0;z-index:20000;background:var(--bg);color:var(--ink);overflow:hidden;cursor:none;font-feature-settings:"tnum" 1,"ss01" 1}
.stg-root.is-wide{--fw:min(100vw,calc(var(--r)*100vh));--fh:min(calc(100vw/var(--r)),100vh);--u:min(calc(1.7778vw/var(--r)),1.7778vh);inset:auto;left:50%;top:50%;translate:-50% -50%;width:var(--fw);height:min(calc(100vw/var(--r)),100vh);box-shadow:0 0 0 100vmax #000}
.stg-root:hover{cursor:default}
.stg-bg{position:absolute;inset:0;pointer-events:none}
.stg-ring{position:absolute;right:calc(var(--u)*-34);top:calc(50% - var(--u)*60);width:calc(var(--u)*120);aspect-ratio:3264/4096;transform-origin:51.1% 46.58%;opacity:.32;will-change:transform,opacity;transition:translate 1.4s cubic-bezier(.65,0,.25,1),scale 1.4s cubic-bezier(.65,0,.25,1),opacity 1.4s ease}
.stg-ring-spin{position:absolute;inset:0;transform-origin:51.1% 46.58%;will-change:transform;animation:stg-spin 240s linear infinite}
.stg-ring-art{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}
/* the ring's slow turn pauses for the intro, so the soft copy is drawn once
   instead of every frame; nobody sees a 240 s rotation stop for 8 s */
.stg-root.is-intro .stg-ring-spin{animation-play-state:paused}
.stg-ring.is-dad{opacity:.4}
.stg-ring.is-dad .stg-ring-art{mix-blend-mode:normal;filter:none;isolation:isolate}
.stg-ring.is-dad .stg-ring-art img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;filter:grayscale(1) brightness(1.05) contrast(1.2)}
.stg-ring.is-dad .stg-ring-art i{position:absolute;inset:0;background:conic-gradient(from 160deg at 51.1% 46.58%,#0b1a6b,#2340d6 14%,#3f86ff 30%,#3fb8ff 42%,#5d8dff 52%,#5a63f2 66%,#1d2fa8 80%,#3f86ff 90%,#0b1a6b);mix-blend-mode:color;-webkit-mask:url(/stage/ring.png) center/contain no-repeat;mask:url(/stage/ring.png) center/contain no-repeat}
.stg-ring-soft{filter:blur(calc(var(--u)*1.1));opacity:.001;transition:opacity 1.6s ease}
.stg-ring.is-dad .stg-ring-soft{filter:blur(calc(var(--u)*1.1))}
.stg-ring.is-dad .stg-ring-soft img{filter:grayscale(1) brightness(1.05) contrast(1.2)}
/* intro: the ring comes to the middle of the screen, grows and softens */
.stg-root.is-intro .stg-ring{translate:calc(var(--u)*24.68 - var(--fw)/2) calc(var(--u)*-10.15);scale:1.4;opacity:.42}
.stg-root.is-intro .stg-ring.is-dad{opacity:.5}
.stg-root.is-intro .stg-ring-soft{opacity:1;transition-delay:.5s}
.stg-root.is-intro .stg-ring-art:not(.stg-ring-soft){opacity:.001;transition:opacity 1.6s ease .5s}
.stg-ring-art:not(.stg-ring-soft){transition:opacity 1.2s ease}
.stg-top,.stg-main,.stg-orbits{transition:opacity .6s ease}
.stg-root.is-intro .stg-top,.stg-root.is-intro .stg-main,.stg-root.is-intro .stg-orbits{opacity:0}
/* out fast so no old text lingers under the intro; back in after it */
.stg-root.is-intro .stg-top,.stg-root.is-intro .stg-main,.stg-root.is-intro .stg-orbits{transition:opacity .22s ease-out}
.stg-orbits{position:absolute;inset:0;width:100%;height:100%}
.stg-root img:not(.stg-ring img){transition:opacity .45s ease}
.stg-root img:not([data-ready]):not(.stg-ring img){opacity:0}
.stg-root[data-brand="digital-assets-day"]{--bg:#050913;--line:rgba(160,190,255,.16);--mute:rgba(214,226,255,.82)}
.stg-orbits circle{fill:none;vector-effect:non-scaling-stroke}
.stg-orbit-track{stroke:rgba(255,255,255,.025);stroke-width:1}
.stg-orbit-light{stroke:rgba(255,255,255,.13);stroke-width:1.6;stroke-linecap:round;filter:blur(1.2px);animation:stg-orbit linear infinite}
.is-acc .stg-orbit-light{stroke:color-mix(in srgb,var(--acc) 30%,transparent)}
@keyframes stg-orbit{from{stroke-dashoffset:0}to{stroke-dashoffset:calc(var(--len) * -1)}}
.stg-tl{display:block}
.stg-ticker-title .stg-tl,.stg-lede .stg-tl,.stg-intro-title .stg-tl,.stg-wrap-next .stg-tl{display:inline}
.stg-ticker-title .stg-tl+.stg-tl,.stg-lede .stg-tl+.stg-tl,.stg-intro-title .stg-tl+.stg-tl{margin-left:.9em;opacity:.75}
.stg-label-sub{margin-left:calc(var(--u)*2.4);color:var(--mute)}
.stg-intro-eyebrow{display:flex;gap:calc(var(--u)*2.4)}
.stg-intro-eyebrow span+span{color:var(--acc)}
.stg-panel-state{display:flex;gap:14px}
@keyframes stg-spin{to{transform:rotate(360deg)}}


.stg-top{position:absolute;left:calc(var(--u)*5);right:calc(var(--u)*5);top:calc(var(--u)*4);display:flex;align-items:center;justify-content:space-between;gap:calc(var(--u)*3);z-index:2}
.stg-brand{display:flex;align-items:center;gap:calc(var(--u)*1.4);min-width:0}
.stg-wordmark{height:calc(var(--u)*4.2);width:auto}
.stg-including{font-weight:600;letter-spacing:.01em;font-size:calc(var(--u)*1.2);color:var(--mute)}
.stg-dad{height:calc(var(--u)*3);width:auto}
.stg-dad-solo{height:calc(var(--u)*4.4)}
.stg-track{display:flex;align-items:center;gap:calc(var(--u)*1.2);flex-wrap:wrap}
.stg-track-name{font-weight:600;font-size:calc(var(--u)*1.2);letter-spacing:.01em;color:var(--acc)}
.stg-track-by{font-weight:600;font-size:calc(var(--u)*1.2);letter-spacing:.01em;color:var(--mute)}
.stg-track-logos{display:flex;gap:calc(var(--u)*.8);align-items:center}
.stg-track-plate{display:flex;align-items:center;justify-content:center;height:calc(var(--u)*3.4);padding:0 calc(var(--u)*1);border-radius:calc(var(--u)*.4)}
.stg-track-plate.is-light{background:#fff}
.stg-track-plate img{display:block;max-height:calc(var(--u)*2.7);max-width:calc(var(--u)*11);width:auto;height:auto}
.stg-intro-track{position:absolute;left:0;right:0;bottom:calc(var(--u)*5);display:flex;justify-content:center;z-index:2;animation:stg-rise .9s cubic-bezier(.2,.7,.1,1) 4s both}
.stg-where{display:flex;align-items:center;gap:calc(var(--u)*1.4);white-space:nowrap}
.stg-stage{font-weight:600;letter-spacing:.01em;font-size:calc(var(--u)*1.2);color:var(--mute)}
.stg-sep{width:1px;height:calc(var(--u)*1.6);background:var(--line)}
.stg-clock{font-size:calc(var(--u)*1.9);letter-spacing:.04em}

.stg-main{position:absolute;left:calc(var(--u)*5);right:calc(var(--u)*5);top:calc(var(--u)*11.5);bottom:calc(var(--u)*4.4);z-index:2}
.stg-scene{height:100%;display:flex;flex-direction:column;animation:stg-in 1.2s cubic-bezier(.22,.61,.36,1) .45s both}
@keyframes stg-in{from{opacity:0;transform:translateY(calc(var(--u)*.5*var(--rise,1)))}to{opacity:1;transform:none}}
@keyframes stg-fade{from{opacity:0}}
@keyframes stg-layer-out{to{opacity:0}}
.stg-layer{position:absolute;inset:0}
.stg-layer.is-leaving{pointer-events:none;animation:stg-layer-out .35s cubic-bezier(.4,0,1,1) forwards}

.stg-head{display:flex;flex-direction:column;gap:calc(var(--u)*1.1);max-width:calc(var(--u)*82);margin-bottom:calc(var(--u)*2.4)}
.stg-head-row{display:flex;align-items:center;gap:calc(var(--u)*2.4);flex-wrap:wrap}
.stg-label{font-weight:600;display:inline-flex;align-items:center;gap:calc(var(--u)*.8);font-size:calc(var(--u)*1.2);letter-spacing:.01em;color:var(--ink)}
.stg-label i{width:calc(var(--u)*.7);height:calc(var(--u)*.7);background:var(--acc)}
.stg-countdown{font-size:calc(var(--u)*1.2);letter-spacing:.12em;color:var(--acc);display:inline-flex;align-items:baseline;gap:calc(var(--u)*.6)}
.stg-countdown small{font-weight:600;font-size:inherit;color:var(--mute);letter-spacing:.01em}
.stg-meta{font-weight:600;display:flex;gap:calc(var(--u)*3);font-size:calc(var(--u)*1.25);color:var(--mute);letter-spacing:.01em}
.stg-title{margin:0;font-weight:800;line-height:1.1;letter-spacing:-.025em;font-size:calc(var(--u)*5.6*var(--fit,1));text-wrap:balance;padding-bottom:.06em}
.stg-title.is-mid{font-size:calc(var(--u)*4.5)}
.stg-title.is-long{font-size:calc(var(--u)*3.6*max(var(--fit,1),.8));line-height:1.12}
.stg-huge{font-size:calc(var(--u)*7.4)}
.stg-subtitle{margin:calc(var(--u)*.8) 0 0;font-weight:800;font-size:calc(var(--u)*2.8);line-height:1.14;letter-spacing:-.015em;text-wrap:balance}
.stg-lede{margin:calc(var(--u)*1.6) 0 0;font-size:calc(var(--u)*1.8);line-height:1.35;color:var(--mute);max-width:calc(var(--u)*70)}

/* people */
.stg-people{list-style:none;margin:auto 0 0;padding:0;display:grid;gap:calc(var(--u)*1.6)}
.stg-people li{display:flex;gap:calc(var(--u)*1.6);align-items:center;min-width:0;animation:stg-in 1.1s cubic-bezier(.22,.61,.36,1) both}
.stg-portrait{display:block;flex:none;position:relative;border-radius:50%;aspect-ratio:1;min-height:0;overflow:hidden;box-sizing:border-box;padding:calc(var(--u)*.28);border:calc(var(--u)*.32) solid var(--acc);background:var(--bg)}
/* the photo is laid over the circle rather than sizing it, so a portrait-
   format picture can never stretch the ring into an oval */
.stg-portrait img,.stg-portrait svg{position:absolute;inset:calc(var(--u)*.28);display:block;width:calc(100% - var(--u)*.56);height:calc(100% - var(--u)*.56);border-radius:50%;object-fit:cover;object-position:50% 22%}
.stg-person-text{display:flex;flex-direction:column;gap:calc(var(--u)*.35);min-width:0;padding-bottom:calc(var(--u)*.2)}
.stg-tag{font-weight:600;align-self:flex-start;font-size:calc(var(--u)*1.2);letter-spacing:.01em;color:var(--acc);border:1px solid color-mix(in srgb,var(--acc) 55%,transparent);padding:calc(var(--u)*.2) calc(var(--u)*.5);margin-bottom:calc(var(--u)*.3)}
.stg-name{font-weight:700;font-size:calc(var(--u)*1.75);line-height:1.12;letter-spacing:-.01em}
.stg-role{font-size:calc(var(--u)*1.35);line-height:1.35;color:var(--mute);}

.stg-people.is-solo{grid-template-columns:1fr}
.stg-people.is-solo .stg-portrait{width:calc(var(--u)*15);height:calc(var(--u)*15)}
.stg-people.is-solo .stg-name{font-size:calc(var(--u)*3)}
.stg-people.is-solo .stg-role{font-size:calc(var(--u)*1.5);max-width:calc(var(--u)*50)}
.stg-people.is-row{grid-template-columns:repeat(3,minmax(0,1fr))}
.stg-people.is-row .stg-portrait{width:calc(var(--u)*9.4*var(--fit,1));height:calc(var(--u)*9.4*var(--fit,1))}
.stg-people.is-strip{grid-template-columns:repeat(var(--cols,5),minmax(0,1fr));gap:calc(var(--u)*1.4)}
.stg-people.is-strip[data-n="4"]{--cols:4}
.stg-people.is-strip[data-n="6"]{--cols:6}
.stg-people.is-strip li{flex-direction:column;align-items:flex-start;gap:calc(var(--u)*.8)}
.stg-people.is-strip .stg-portrait{width:min(100%,calc(var(--u)*8.4*var(--fit,1)));height:auto}
/* four or more people: a smaller title leaves room for every name, role,
   company and the moderator note */
.stg-main:has(.stg-people.is-strip) .stg-title:not(.is-long){font-size:calc(var(--u)*4.4*var(--fit,1))}
.stg-people.is-strip .stg-name{font-size:calc(var(--u)*1.45)}
.stg-people.is-strip .stg-role{font-size:calc(var(--u)*1.25)}
.stg-company{font-weight:700;font-size:calc(var(--u)*1.5);line-height:1.25;color:var(--ink);padding-bottom:.08em}
.stg-people.is-solo .stg-company{font-size:calc(var(--u)*2)}
.stg-people.is-strip .stg-company{font-size:calc(var(--u)*1.3)}
.stg-person-text .stg-tag{margin-top:calc(var(--u)*.5)}
.stg-session.has-group .stg-people.is-strip{margin-top:auto}
.stg-break-next .stg-people{grid-template-columns:1fr;gap:calc(var(--u)*1.1)}
.stg-break-next .stg-people li{flex-direction:row;align-items:center}
.stg-break-next .stg-portrait{width:calc(var(--u)*6.4)!important;height:calc(var(--u)*6.4)!important}
.stg-break-next .stg-name{font-size:calc(var(--u)*1.45)}
.is-mod .stg-portrait{opacity:.92}

.stg-ticker{margin-top:calc(var(--u)*2.2);padding-top:calc(var(--u)*1.3);border-top:1px solid var(--line);display:flex;align-items:baseline;gap:calc(var(--u)*1.4);font-size:calc(var(--u)*1.2);min-width:0}
.stg-ticker-label{font-weight:600;letter-spacing:.01em;font-size:calc(var(--u)*1.2);color:var(--acc)}
.stg-ticker-time{color:var(--mute)}
.stg-ticker-title{font-weight:600;white-space:nowrap;overflow:hidden;line-height:1.35;padding-bottom:.08em;text-overflow:ellipsis;min-width:0}

.stg-break{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:calc(var(--u)*5);align-items:stretch}
.stg-break-main{display:flex;flex-direction:column;justify-content:center;gap:calc(var(--u)*1.6)}
.stg-break-next{display:flex;flex-direction:column;justify-content:flex-end;padding-left:calc(var(--u)*3);border-left:1px solid var(--line)}
.stg-break-next .stg-people{margin-top:calc(var(--u)*2.2)}
.stg-center{justify-content:center;gap:calc(var(--u)*.4)}
.stg-center .stg-label{margin-bottom:calc(var(--u)*1.4)}
.stg-center .stg-ticker{margin-top:auto}

.stg-pause{position:absolute;inset:0;z-index:6;background:var(--bg);padding:calc(var(--u)*11.5) calc(var(--u)*5) calc(var(--u)*4.4);animation:stg-fade .9s ease both}
.stg-black{position:absolute;inset:0;z-index:9;background:#000;animation:stg-fade .9s ease both}
.stg-start{position:absolute;inset:0;z-index:11;background:var(--bg);display:flex;flex-direction:column;justify-content:center;gap:calc(var(--u)*1.8);padding:0 calc(var(--u)*5);cursor:default}
.stg-start-options{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:calc(var(--u)*1.2);max-width:calc(var(--u)*90)}
.stg-start-group{display:flex;flex-direction:column;gap:calc(var(--u)*.8)}
.stg-start-caption{font-weight:600;font-size:calc(var(--u)*1.2);letter-spacing:.01em;color:var(--mute)}
.stg-start-options a{all:unset;cursor:pointer;display:flex;flex-direction:column;gap:calc(var(--u)*.5);padding:calc(var(--u)*1.6);border:1px solid var(--line);border-radius:calc(var(--u)*.5);color:var(--ink)}
.stg-start-options a strong{font-size:calc(var(--u)*1.6)}
.stg-start-options a small{font-size:calc(var(--u)*1.2);color:var(--mute)}
.stg-start-options a.is-on{border-color:var(--acc);box-shadow:inset 0 0 0 1px var(--acc)}
.stg-start-options button[data-dad].is-on{border-color:#8fb4ff;box-shadow:inset 0 0 0 1px #8fb4ff}
.stg-start-go[disabled]{opacity:.35;cursor:default}
.stg-start-options button,.stg-start-go{all:unset;cursor:pointer;display:flex;flex-direction:column;gap:calc(var(--u)*.5);padding:calc(var(--u)*1.6);border:1px solid var(--line);border-radius:calc(var(--u)*.5);color:var(--ink)}
.stg-start-options button strong{font-size:calc(var(--u)*1.6)}
.stg-start-options button small{font-size:calc(var(--u)*1.2);color:var(--mute)}
.stg-start-options button.is-on{border-color:var(--acc);box-shadow:inset 0 0 0 1px var(--acc)}
.stg-start-options button:focus-visible,.stg-start-go:focus-visible{outline:2px solid var(--acc);outline-offset:3px}
.stg-start-go{align-self:flex-start;background:var(--acc);color:#0a090c;font-weight:800;font-size:calc(var(--u)*1.3);padding:calc(var(--u)*1.1) calc(var(--u)*2.2);border:0}

/* intro */
.stg-intro{position:absolute;inset:0;z-index:5;display:flex;align-items:center;justify-content:center;animation:stg-intro-out .8s ease-in ${INTRO_MS - 800}ms forwards}
@keyframes stg-intro-out{to{opacity:0}}
.stg-intro-content{position:relative;display:flex;flex-direction:column;align-items:center;text-align:center;gap:calc(var(--u)*1.6);padding:0 calc(var(--u)*12);max-width:calc(var(--u)*90);animation:stg-intro-content-out .9s cubic-bezier(.6,0,.4,1) ${INTRO_MS - 1600}ms forwards}
@keyframes stg-intro-content-out{to{opacity:0;transform:scale(1.06)}}
.stg-intro-eyebrow{font-weight:600;letter-spacing:.01em;font-size:calc(var(--u)*1.35);color:rgba(255,255,255,.75);animation:stg-rise .8s cubic-bezier(.2,.7,.1,1) 3s both}
.stg-intro-eyebrow b{font-weight:400;color:var(--acc);margin:0 .6em}
.stg-intro-faces{display:flex;gap:calc(var(--u)*1.2);justify-content:center}
.stg-intro-faces figure{margin:0;display:flex;flex-direction:column;align-items:center;gap:calc(var(--u)*.6);animation:stg-rise .9s cubic-bezier(.2,.8,.2,1) both}
.stg-intro-faces .stg-portrait{width:calc(var(--u)*9);height:calc(var(--u)*9)}
.stg-intro-faces.is-solo .stg-portrait{width:calc(var(--u)*16);height:calc(var(--u)*16)}
.stg-intro-faces figcaption{display:flex;flex-direction:column;align-items:center;gap:calc(var(--u)*.3);min-height:calc(var(--u)*1.2)}
.stg-intro-faces .stg-tag{align-self:center;margin:0}
.stg-intro-cap{font-size:calc(var(--u)*1.4);font-weight:700;color:#fff;max-width:calc(var(--u)*16);line-height:1.25}
.stg-intro-mask{display:block;overflow:hidden;padding-bottom:.28em;margin-bottom:-.2em}
.stg-intro-name{display:block;font-weight:800;font-size:calc(var(--u)*5.2);line-height:1.1;letter-spacing:-.025em;color:var(--acc);text-wrap:balance;transform:translateY(110%);animation:stg-up 1s cubic-bezier(.2,.8,.1,1) 3.45s forwards}
@keyframes stg-up{to{transform:none}}
.stg-intro-mark{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;perspective:calc(var(--u)*90);pointer-events:none;z-index:1}
.stg-intro-mark-out{position:relative;transform-style:preserve-3d;animation:stg-mark-out .55s cubic-bezier(.55,0,.35,1) 2.65s forwards}
.stg-intro-mark-in{position:relative;width:calc(var(--u)*30);transform-style:preserve-3d;animation:stg-mark-in 1.7s cubic-bezier(.3,.55,.15,1) .95s both}
.stg-intro-mark-in.is-dad{width:calc(var(--u)*38)}
.stg-intro-mark-in img{display:block;width:100%;height:auto}
.stg-intro-shine{position:absolute;inset:0;-webkit-mask-size:100% 100%;mask-size:100% 100%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;background:linear-gradient(100deg,transparent 40%,rgba(255,255,255,.9) 50%,transparent 60%);background-size:300% 100%;background-position:120% 0;mix-blend-mode:screen;animation:stg-shine 1.1s cubic-bezier(.45,0,.25,1) 1.6s forwards}
.stg-intro-mark-floor{position:absolute;left:8%;right:8%;top:calc(100% + var(--u)*2.2);height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent);transform:scaleX(0);animation:stg-floor 1.2s cubic-bezier(.2,.7,.1,1) 1.4s forwards}
@keyframes stg-mark-in{0%{opacity:0;transform:translateZ(calc(var(--u)*-60)) translateY(calc(var(--u)*6)) rotateX(72deg)}55%{opacity:1}100%{opacity:1;transform:translateZ(0) translateY(0) rotateX(10deg) rotateY(-4deg)}}
@keyframes stg-mark-out{to{opacity:0;transform:translateZ(calc(var(--u)*40))}}
@keyframes stg-shine{to{background-position:-20% 0}}
@keyframes stg-floor{to{transform:scaleX(1)}}
.stg-intro-title{font-weight:600;font-size:calc(var(--u)*1.7);letter-spacing:.01em;color:rgba(255,255,255,.7);max-width:calc(var(--u)*72);line-height:1.5;text-wrap:balance;animation:stg-rise 1s cubic-bezier(.2,.7,.1,1) 3.9s both}
@keyframes stg-rise{from{opacity:0;transform:translateY(calc(var(--u)*1*var(--rise,1)))}to{opacity:1;transform:none}}

.stg-deck{position:absolute;inset:0;z-index:4;background:#000;display:flex;align-items:center;justify-content:center;animation:stg-fade .8s ease both}
.stg-deck canvas{display:block}
.stg-deck-img{display:block;max-width:100%;max-height:100%;object-fit:contain}
.stg-deck-error{font-size:calc(var(--u)*1.6);color:rgba(255,255,255,.7)}

.stg-panel{position:absolute;left:50%;bottom:calc(var(--u)*1.6);transform:translate(-50%,calc(var(--u)*6));opacity:0;transition:all .3s ease;display:flex;flex-wrap:wrap;justify-content:center;gap:8px;padding:10px 12px;border-radius:12px;background:rgba(18,17,22,.94);border:1px solid rgba(255,255,255,.14);z-index:10;max-width:94vw}
.stg-panel.is-open{opacity:1;transform:translate(-50%,0)}
.stg-panel button{font-family:inherit;font-size:14px;font-weight:600;line-height:1;color:#fff;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.16);border-radius:8px;padding:9px 12px;cursor:pointer}
.stg-panel button:hover{background:rgba(255,255,255,.15)}
.stg-panel button:focus-visible{outline:2px solid var(--acc);outline-offset:2px}
.stg-panel-state{align-self:center;font-size:14px;font-weight:700;line-height:1;letter-spacing:.08em;text-transform:uppercase;color:var(--acc);padding:0 6px}
.stg-badge{position:absolute;right:calc(var(--u)*5);bottom:calc(var(--u)*1.1);font-size:14px;font-weight:600;line-height:1;letter-spacing:.01em;color:rgba(255,255,255,.32);z-index:3}
.stg-sparkles{position:absolute;inset:0;pointer-events:none}
.stg-sparkles svg{position:absolute;width:calc(var(--u)*var(--s));height:calc(var(--u)*var(--s));translate:-50% -50%;fill:#fff;opacity:0;will-change:transform,opacity;animation:stg-twinkle 2.4s ease-in-out both}
.stg-sparkles svg:nth-child(odd){fill:var(--acc)}
@keyframes stg-twinkle{0%{opacity:0;transform:scale(.2) rotate(-30deg)}35%{opacity:.95;transform:scale(1) rotate(0)}100%{opacity:0;transform:scale(.4) rotate(25deg)}}
/* no tells: no corner brackets, blinking dots, dividers or crew hints on
   the audience screen */
.stg-label i,.stg-sep,.stg-badge{display:none}
.stg-label{gap:0;color:var(--acc)}
.stg-intro-shine,.stg-intro-mark-floor{display:none}
/* the day mark rises softly and then floats, like something held up */
.stg-intro-mark{perspective:none}
.stg-intro-mark-in{animation:stg-mark-rise 1.3s cubic-bezier(.2,.7,.1,1) .95s both,stg-float 3.2s ease-in-out 2.25s infinite alternate}
.stg-intro-mark-out{animation:stg-mark-fade .6s ease-in 2.7s forwards}
@keyframes stg-mark-rise{from{opacity:0;transform:translateY(calc(var(--u)*2.4)) scale(.96)}to{opacity:1;transform:none}}
@keyframes stg-float{to{transform:translateY(calc(var(--u)*-.8))}}
@keyframes stg-mark-fade{to{opacity:0;transform:translateY(calc(var(--u)*-1.5))}}
@media (prefers-reduced-motion:reduce){.stg-root *{animation-duration:.01ms!important;animation-delay:0s!important;transition:none!important}.stg-intro-name{transform:none}}
/* Side layout, on Nakamoto every day and on every room with a free floor:
   stage and clock at the top centre, the session on the left, the speakers
   large in their own column on the right, never under the text. */
.stg-root.is-side .stg-top{align-items:flex-start}
.stg-root.is-side .stg-where{position:absolute;left:50%;top:calc(var(--u)*.6);translate:-50% 0}
.stg-root.is-side .stg-stage{font-size:calc(var(--u)*1.5)}
.stg-root.is-side .stg-clock{font-size:calc(var(--u)*2.2)}
.stg-root.is-side .stg-session{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.35fr);grid-template-rows:1fr auto;column-gap:calc(var(--u)*5)}
.stg-root.is-side .stg-session .stg-head{grid-column:1;grid-row:1 / span 2;align-self:center}
.stg-root.is-side .stg-session .stg-title,.stg-root.is-side .stg-session .stg-title.is-mid{font-size:calc(var(--u)*4.4*var(--fit,1))}
.stg-root.is-side .stg-session .stg-title.is-long{font-size:calc(var(--u)*3.4*var(--fit,1))}
.stg-root.is-side .stg-session .stg-ticker{grid-column:2;grid-row:2;margin-top:calc(var(--u)*1.2)}
.stg-root.is-side :is(.stg-session,.stg-break-next) .stg-people{grid-column:2;grid-row:1;margin:0;align-self:center;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:calc(var(--u)*1.6*var(--fit,1)) calc(var(--u)*2.2)}
.stg-root.is-side :is(.stg-session,.stg-break-next) .stg-people li{flex-direction:row;align-items:center;gap:calc(var(--u)*1.4)}
.stg-root.is-side :is(.stg-session,.stg-break-next) .stg-people .stg-portrait{width:calc(var(--u)*7.5*var(--fit,1));height:calc(var(--u)*7.5*var(--fit,1))}
.stg-root.is-side :is(.stg-session,.stg-break-next) .stg-people .stg-name{font-size:calc(var(--u)*1.8*var(--fit,1))}
.stg-root.is-side :is(.stg-session,.stg-break-next) .stg-people .stg-role{font-size:calc(var(--u)*1.25*max(var(--fit,1),.85))}
.stg-root.is-side :is(.stg-session,.stg-break-next) .stg-people .stg-company{font-size:calc(var(--u)*1.35*max(var(--fit,1),.85))}
.stg-root.is-side :is(.stg-session,.stg-break-next) .stg-people[data-n="1"]{grid-template-columns:1fr}
.stg-root.is-side :is(.stg-session,.stg-break-next) .stg-people[data-n="1"] li{gap:calc(var(--u)*2.4)}
.stg-root.is-side :is(.stg-session,.stg-break-next) .stg-people[data-n="1"] .stg-portrait{width:calc(var(--u)*20*var(--fit,1));height:calc(var(--u)*20*var(--fit,1))}
.stg-root.is-side :is(.stg-session,.stg-break-next) .stg-people[data-n="1"] .stg-name{font-size:calc(var(--u)*3.6*var(--fit,1))}
.stg-root.is-side :is(.stg-session,.stg-break-next) .stg-people[data-n="1"] .stg-role{font-size:calc(var(--u)*1.8*max(var(--fit,1),.8))}
.stg-root.is-side :is(.stg-session,.stg-break-next) .stg-people[data-n="1"] .stg-company{font-size:calc(var(--u)*2.2*max(var(--fit,1),.8))}
.stg-root.is-side :is(.stg-session,.stg-break-next) .stg-people[data-n="2"]{grid-template-columns:repeat(2,minmax(0,1fr))}
.stg-root.is-side :is(.stg-session,.stg-break-next) .stg-people[data-n="2"] .stg-portrait{width:calc(var(--u)*13*var(--fit,1));height:calc(var(--u)*13*var(--fit,1))}
.stg-root.is-side :is(.stg-session,.stg-break-next) .stg-people[data-n="2"] .stg-name{font-size:calc(var(--u)*2.5*var(--fit,1))}
.stg-root.is-side :is(.stg-session,.stg-break-next) .stg-people[data-n="2"] .stg-role{font-size:calc(var(--u)*1.45*max(var(--fit,1),.85))}
.stg-root.is-side :is(.stg-session,.stg-break-next) .stg-people[data-n="2"] .stg-company{font-size:calc(var(--u)*1.7*max(var(--fit,1),.85))}
.stg-root.is-side :is(.stg-session,.stg-break-next) .stg-people[data-n="3"] li{flex-direction:column;align-items:flex-start}
.stg-root.is-side :is(.stg-session,.stg-break-next) .stg-people[data-n="3"] .stg-portrait{width:calc(var(--u)*12*var(--fit,1));height:calc(var(--u)*12*var(--fit,1))}
.stg-root.is-side :is(.stg-session,.stg-break-next) .stg-people[data-n="3"] .stg-name{font-size:calc(var(--u)*2.2*var(--fit,1))}
.stg-root.is-side :is(.stg-session,.stg-break-next) .stg-people[data-n="3"] .stg-role{font-size:calc(var(--u)*1.35*max(var(--fit,1),.85))}
.stg-root.is-side :is(.stg-session,.stg-break-next) .stg-people[data-n="3"] .stg-company{font-size:calc(var(--u)*1.55*max(var(--fit,1),.85))}
.stg-root.is-side :is(.stg-session,.stg-break-next) .stg-people[data-n="4"]{grid-template-columns:repeat(2,minmax(0,1fr))}
.stg-root.is-side :is(.stg-session,.stg-break-next) .stg-people[data-n="4"] .stg-portrait{width:calc(var(--u)*10*var(--fit,1));height:calc(var(--u)*10*var(--fit,1))}
.stg-root.is-side :is(.stg-session,.stg-break-next) .stg-people[data-n="4"] .stg-name{font-size:calc(var(--u)*2.1*var(--fit,1))}
.stg-root.is-side :is(.stg-session,.stg-break-next) .stg-people[data-n="4"] .stg-role{font-size:calc(var(--u)*1.35*max(var(--fit,1),.85))}
.stg-root.is-side :is(.stg-session,.stg-break-next) .stg-people[data-n="4"] .stg-company{font-size:calc(var(--u)*1.5*max(var(--fit,1),.85))}
.stg-root.is-side .stg-break{grid-template-columns:minmax(0,1fr) minmax(0,1.35fr)}
.stg-root.is-side .stg-break-next{justify-content:center}
.stg-root.is-side .stg-break-next .stg-people{margin-top:calc(var(--u)*1.6)}

/* Digital Assets Day: the lower part stays free for the panel in front, and
   the Digital Assets Day mark is three times as large */
.stg-root.is-floor .stg-dad-solo{height:calc(var(--u)*13.2)}
.stg-root.is-floor .stg-main{top:calc(var(--u)*4);bottom:calc(var(--floor)*100%)}
.stg-root.is-floor .stg-session .stg-head{align-self:start;padding-top:calc(var(--u)*14.4)}
.stg-root.is-floor .stg-session .stg-title,.stg-root.is-floor .stg-session .stg-title.is-mid{font-size:calc(var(--u)*3.6*var(--fit,1))}
.stg-root.is-floor .stg-session .stg-title.is-long{font-size:calc(var(--u)*2.9*var(--fit,1))}
.stg-root.is-floor .stg-session .stg-people{align-self:start;padding-top:calc(var(--u)*4.6)}
.stg-root.is-floor .stg-break{align-items:start}
.stg-root.is-floor .stg-break-main{justify-content:flex-start;padding-top:calc(var(--u)*14.4);gap:calc(var(--u)*1)}
.stg-root.is-floor .stg-break-main .stg-huge{font-size:calc(var(--u)*4.6*var(--fit,1))}
.stg-root.is-floor .stg-break-next{justify-content:flex-start;padding-top:calc(var(--u)*4.6)}
.stg-root.is-floor .stg-break-next .stg-subtitle{font-size:calc(var(--u)*2.3*var(--fit,1))}
.stg-root.is-floor .stg-break-next .stg-people{margin-top:calc(var(--u)*1.4)}
.stg-root.is-floor .stg-pause{padding-bottom:calc(var(--floor)*var(--fh) + var(--u)*2)}
/* framed rooms: the slides as a card on the right, over the background */
.stg-root.is-framed-deck .stg-deck{background:none;left:calc(var(--u)*62);right:calc(var(--u)*5);top:calc(var(--u)*7.6);bottom:calc(var(--u)*3.4);justify-content:flex-end}
.stg-root.is-framed-deck .stg-deck canvas,.stg-root.is-framed-deck .stg-deck-img{border-radius:calc(var(--u)*.6);box-shadow:0 0 0 1px var(--line),0 calc(var(--u)*1.2) calc(var(--u)*5) rgba(0,0,0,.6)}
.stg-root.is-framed-deck .stg-deck-img{max-width:100%;max-height:100%}
.stg-deck-side{justify-content:flex-end;gap:calc(var(--u)*1.2);max-width:calc(var(--u)*50);overflow:clip;overflow-clip-margin:calc(var(--u)*2)}
.stg-deck-side .stg-title{font-size:calc(var(--u)*3*var(--fit,1));line-height:1.15}
.stg-deck-people{margin:0;font-size:calc(var(--u)*1.6);font-weight:600;line-height:1.35;color:var(--mute)}
.stg-root.is-floor .stg-deck-side{justify-content:flex-start;padding-top:calc(var(--u)*14.4)}
.stg-root.is-floor.is-framed-deck .stg-deck{bottom:calc(var(--floor)*var(--fh));align-items:flex-start}
${OPENING_CSS}
`;
