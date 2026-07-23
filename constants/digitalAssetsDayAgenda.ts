/**
 * The published conference programme, one entry per talk so every event can
 * interleave its sessions chronologically in the same feed. So far only the
 * Digital Assets Day (Day 2, October 30, 2026, curated by Bundesblock) is
 * announced; add First Conference Day and Hackathon talks in between as they
 * are published, keeping the array in chronological order.
 *
 * This reflects the preliminary Bundesblock programme (session-title excerpts,
 * subject to change). Speakers are not announced yet: a talk without `speaker`
 * renders a silhouette and "Speaker to be announced".
 */

export type AgendaEventKey = "conference" | "digital-assets-day" | "hackathon";

export const AGENDA_STAGES = ["Main Stage", "Executive Forum"] as const;

/** Focus tracks of the Digital Assets Day (they only exist on that day). */
// Colors sampled from the official Bundesblock agenda PDF.
export const DAD_TRACKS = [
  {
    name: "Digital Capital Markets",
    dot: "bg-[#4285f4]",
    accent: "border-[#4285f4]",
    active: "border-[#4285f4] bg-[#4285f4]/15 text-white",
  },
  {
    name: "Stablecoins & Payments",
    dot: "bg-[#f5f52c]",
    accent: "border-[#f5f52c]",
    active: "border-[#f5f52c] bg-[#f5f52c]/15 text-white",
  },
  {
    name: "Policy & Regulation",
    dot: "bg-[#ff9447]",
    accent: "border-[#ff9447]",
    active: "border-[#ff9447] bg-[#ff9447]/15 text-white",
  },
  {
    name: "Tokenization & RWA",
    dot: "bg-[#5ccc7a]",
    accent: "border-[#5ccc7a]",
    active: "border-[#5ccc7a] bg-[#5ccc7a]/15 text-white",
  },
  {
    name: "Institutional Trust Infrastructure",
    dot: "bg-[#a64d79]",
    accent: "border-[#a64d79]",
    active: "border-[#a64d79] bg-[#a64d79]/15 text-white",
  },
  {
    name: "General Interest",
    dot: "bg-[#d9d9d9]",
    accent: "border-[#d9d9d9]",
    active: "border-[#d9d9d9] bg-[#d9d9d9]/15 text-white",
  },
] as const;

export type DadTrackName = (typeof DAD_TRACKS)[number]["name"];

type Common = { event: AgendaEventKey; day: string };

export type AgendaEntry =
  | (Common & {
      kind: "talk";
      time: string;
      duration: number; // minutes
      stage: string;
      track: DadTrackName;
      title?: string; // missing = to be announced
      format?: string;
      speaker?: string; // missing = to be announced
    })
  | (Common & {
      kind: "milestone";
      label: string;
      time?: string;
      stage?: string;
    });

const DAD: Common = { event: "digital-assets-day", day: "2026-10-30" };
const MAIN = "Main Stage";
const FORUM = "Executive Forum";
const DEEP_DIVE = "Deep Dive Format";

// Chronological order. Times are aligned to the preliminary agenda structure
// and may still shift.
export const agendaEntries: AgendaEntry[] = [
  { ...DAD, kind: "milestone", label: "Doors Open & Arrival", time: "8:00" },
  {
    ...DAD,
    kind: "milestone",
    label: "Start of Programme at the Main Stage",
    time: "8:00",
    stage: FORUM,
  },
  {
    ...DAD,
    kind: "talk",
    time: "9:00",
    duration: 30,
    stage: MAIN,
    track: "General Interest",
    title: "The State of Digital Assets 2026",
  },
  {
    ...DAD,
    kind: "talk",
    time: "9:30",
    duration: 30,
    stage: MAIN,
    track: "Stablecoins & Payments",
    title: "The New Money Stack",
  },
  {
    ...DAD,
    kind: "talk",
    time: "10:00",
    duration: 45,
    stage: MAIN,
    track: "Stablecoins & Payments",
    title: "Stablecoins' Main Use Cases",
  },
  {
    ...DAD,
    kind: "talk",
    time: "10:45",
    duration: 30,
    stage: MAIN,
    track: "Digital Capital Markets",
    title: "Portfolio Strategy & Digital Assets",
  },
  {
    ...DAD,
    kind: "talk",
    time: "11:00",
    duration: 60,
    stage: FORUM,
    track: "Stablecoins & Payments",
    format: DEEP_DIVE,
    title: "Stablecoins, Treasury & Agentic Payments",
  },
  {
    ...DAD,
    kind: "talk",
    time: "11:15",
    duration: 45,
    stage: MAIN,
    track: "Digital Capital Markets",
    title: "On-Chain Capital Markets in the EU?",
  },
  {
    ...DAD,
    kind: "talk",
    time: "12:00",
    duration: 60,
    stage: FORUM,
    track: "Digital Capital Markets",
    format: DEEP_DIVE,
    title: "Portfolio Construction & Institutional Allocation",
  },
  {
    ...DAD,
    kind: "talk",
    time: "13:00",
    duration: 30,
    stage: MAIN,
    track: "Tokenization & RWA",
    title: "Tokenization Status Quo",
  },
  {
    ...DAD,
    kind: "talk",
    time: "13:30",
    duration: 30,
    stage: MAIN,
    track: "Tokenization & RWA",
    title: "Data Tokenization & New Business",
  },
  {
    ...DAD,
    kind: "talk",
    time: "14:00",
    duration: 45,
    stage: MAIN,
    track: "Policy & Regulation",
    title: "Regulation & European Competitivity",
  },
  {
    ...DAD,
    kind: "talk",
    time: "15:00",
    duration: 45,
    stage: MAIN,
    track: "Institutional Trust Infrastructure",
    title: "Public Infrastructure Building Blocks",
  },
  {
    ...DAD,
    kind: "talk",
    time: "15:00",
    duration: 60,
    stage: FORUM,
    track: "Tokenization & RWA",
    format: DEEP_DIVE,
    title: "How to Drive Volume Markets",
  },
  {
    ...DAD,
    kind: "talk",
    time: "16:00",
    duration: 45,
    stage: MAIN,
    track: "Institutional Trust Infrastructure",
    title: "Identities & Wallets: Trust by Design",
  },
  {
    ...DAD,
    kind: "talk",
    time: "16:45",
    duration: 30,
    stage: MAIN,
    track: "General Interest",
    title: "The Race for Digital Asset Leadership",
  },
  {
    ...DAD,
    kind: "talk",
    time: "17:00",
    duration: 60,
    stage: FORUM,
    track: "Institutional Trust Infrastructure",
    format: DEEP_DIVE,
    title: "Deutschland- & Euro-Stack (2.0)",
  },
  {
    ...DAD,
    kind: "milestone",
    label: "Evening Event (until 22:00)",
    time: "19:00",
  },
];
