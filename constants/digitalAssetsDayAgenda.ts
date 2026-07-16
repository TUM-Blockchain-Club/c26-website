/**
 * The published conference programme, one entry per talk so every event can
 * interleave its sessions chronologically in the same feed. So far only the
 * Digital Assets Day (Day 2, October 30, 2026, curated by Bundesblock) is
 * announced; add First Conference Day and Hackathon talks in between as they
 * are published, keeping the array in chronological order.
 *
 * Speakers are not announced yet: a talk without `speaker` renders a
 * silhouette and "Speaker to be announced".
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
    name: "Institutional Trust",
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
      stage: string;
      track: DadTrackName;
      format: string;
      formatDetail?: string;
      duration: number;
      title?: string; // missing = to be announced
      speaker?: string; // missing = to be announced
    })
  | (Common & {
      kind: "placeholder";
      time: string;
      stage: string;
      duration: number;
    })
  | (Common & {
      kind: "break";
      time: string;
      label: string;
      duration: number;
      stage?: string;
    })
  | (Common & { kind: "milestone"; label: string; time?: string });

const DAD: Common = { event: "digital-assets-day", day: "2026-10-30" };
const MAIN = "Main Stage";
const FORUM = "Executive Forum";
const DEEP_DIVE = "Focus Deep Dive";
const DEEP_DIVE_DETAIL = "Keynote · Roundtable Discussion · Networking";

export const agendaEntries: AgendaEntry[] = [
  { ...DAD, kind: "milestone", label: "Arrival & Networking", time: "8:00" },
  {
    ...DAD,
    kind: "milestone",
    label: "Executive Forum: Start of Programme at the Main Stage Hall",
    time: "8:00",
  },
  {
    ...DAD,
    kind: "talk",
    time: "8:50",
    stage: MAIN,
    track: "General Interest",
    format: "Opening",
    duration: 10,
    title: "Welcome & Opening",
  },
  {
    ...DAD,
    kind: "talk",
    time: "9:00",
    stage: MAIN,
    track: "General Interest",
    format: "Keynote",
    duration: 15,
    title: "The State of Digital Assets 2026",
  },
  {
    ...DAD,
    kind: "talk",
    time: "9:00",
    stage: FORUM,
    track: "Digital Capital Markets",
    format: "Panel",
    duration: 30,
  },
  {
    ...DAD,
    kind: "talk",
    time: "9:15",
    stage: MAIN,
    track: "General Interest",
    format: "Fireside Chat",
    duration: 20,
    title: "From Hype to Utility: Does Crypto Still Have a PR Problem?",
  },
  { ...DAD, kind: "placeholder", time: "9:30", stage: FORUM, duration: 40 },
  {
    ...DAD,
    kind: "talk",
    time: "9:40",
    stage: MAIN,
    track: "Stablecoins & Payments",
    format: "Keynote",
    duration: 20,
    title: "From Digital Euro to Stablecoin Rails: The New Money Stack",
  },
  {
    ...DAD,
    kind: "talk",
    time: "10:00",
    stage: MAIN,
    track: "Stablecoins & Payments",
    format: "Panel",
    duration: 30,
    title: "Will Stablecoins Become the Default Payment Rail?",
  },
  {
    ...DAD,
    kind: "talk",
    time: "10:10",
    stage: FORUM,
    track: "Stablecoins & Payments",
    format: DEEP_DIVE,
    formatDetail: DEEP_DIVE_DETAIL,
    duration: 60,
    title: "Stablecoins, Treasury & Agentic Payments",
  },
  {
    ...DAD,
    kind: "break",
    time: "10:30",
    label: "Coffee Break",
    duration: 20,
    stage: MAIN,
  },
  {
    ...DAD,
    kind: "talk",
    time: "10:50",
    stage: MAIN,
    track: "Digital Capital Markets",
    format: "Keynote",
    duration: 15,
    title: "Portfolio Construction in the Age of Digital Assets",
  },
  {
    ...DAD,
    kind: "talk",
    time: "11:05",
    stage: MAIN,
    track: "Digital Capital Markets",
    format: "Panel",
    duration: 30,
  },
  {
    ...DAD,
    kind: "talk",
    time: "11:10",
    stage: FORUM,
    track: "Digital Capital Markets",
    format: DEEP_DIVE,
    formatDetail: DEEP_DIVE_DETAIL,
    duration: 60,
    title: "Portfolio Construction & Institutional Allocation",
  },
  {
    ...DAD,
    kind: "talk",
    time: "11:40",
    stage: MAIN,
    track: "General Interest",
    format: "Panel",
    duration: 35,
    title:
      "AI x Blockchain Beyond Payments: Agents, Data Markets & Trusted Automation",
  },
  {
    ...DAD,
    kind: "break",
    time: "12:10",
    label: "Lunch Break",
    duration: 50,
    stage: FORUM,
  },
  {
    ...DAD,
    kind: "break",
    time: "12:15",
    label: "Lunch Break",
    duration: 55,
    stage: MAIN,
  },
  {
    ...DAD,
    kind: "talk",
    time: "13:00",
    stage: FORUM,
    track: "General Interest",
    format: "Panel",
    duration: 35,
    title: "AI x Blockchain Beyond Payments: Decision Maker Briefing",
  },
  {
    ...DAD,
    kind: "talk",
    time: "13:10",
    stage: MAIN,
    track: "Tokenization & RWA",
    format: "Case Study",
    duration: 20,
    title: "Tokenization in Practice: From Pilots to Production",
  },
  {
    ...DAD,
    kind: "talk",
    time: "13:30",
    stage: MAIN,
    track: "Tokenization & RWA",
    format: "Panel",
    duration: 40,
  },
  {
    ...DAD,
    kind: "talk",
    time: "14:00",
    stage: FORUM,
    track: "Tokenization & RWA",
    format: DEEP_DIVE,
    formatDetail: DEEP_DIVE_DETAIL,
    duration: 60,
  },
  {
    ...DAD,
    kind: "talk",
    time: "14:10",
    stage: MAIN,
    track: "Policy & Regulation",
    format: "Panel",
    duration: 25,
    title: "Regulation, Tax & Competitiveness: MiCA 2.0, DAC8, DORA and Beyond",
  },
  {
    ...DAD,
    kind: "break",
    time: "14:35",
    label: "Coffee Break",
    duration: 20,
    stage: MAIN,
  },
  {
    ...DAD,
    kind: "talk",
    time: "14:55",
    stage: MAIN,
    track: "Institutional Trust",
    format: "Keynote",
    duration: 15,
    title: "Institutional Trust Infrastructure: What Enables Trust?",
  },
  {
    ...DAD,
    kind: "break",
    time: "15:00",
    label: "Coffee Break",
    duration: 20,
    stage: FORUM,
  },
  {
    ...DAD,
    kind: "talk",
    time: "15:10",
    stage: MAIN,
    track: "Institutional Trust",
    format: "Panel",
    duration: 35,
    title: "Building Trust at Scale: Custody, Wallets, Identity & Security",
  },
  { ...DAD, kind: "placeholder", time: "15:20", stage: FORUM, duration: 20 },
  {
    ...DAD,
    kind: "talk",
    time: "15:45",
    stage: MAIN,
    track: "Policy & Regulation",
    format: "Fireside Chat",
    duration: 20,
    title: "Cross Border Collaboration: DE, CH, LI and Europe",
  },
  {
    ...DAD,
    kind: "talk",
    time: "16:00",
    stage: FORUM,
    track: "Institutional Trust",
    format: DEEP_DIVE,
    formatDetail: DEEP_DIVE_DETAIL,
    duration: 70,
  },
  {
    ...DAD,
    kind: "talk",
    time: "16:05",
    stage: MAIN,
    track: "Institutional Trust",
    format: "Keynote",
    duration: 20,
    title: "Digital Public Infrastructure",
  },
  { ...DAD, kind: "placeholder", time: "16:25", stage: MAIN, duration: 25 },
  {
    ...DAD,
    kind: "talk",
    time: "16:50",
    stage: MAIN,
    track: "General Interest",
    format: "Closing Conversation",
    duration: 35,
    title: "Society 2035: AI, Digital Assets & the Next Generation",
  },
  { ...DAD, kind: "placeholder", time: "17:10", stage: FORUM, duration: 35 },
  {
    ...DAD,
    kind: "talk",
    time: "17:25",
    stage: MAIN,
    track: "General Interest",
    format: "Closing Keynote",
    duration: 25,
    title: "The Race for Digital Asset Leadership",
  },
  {
    ...DAD,
    kind: "milestone",
    label: "Closing Remarks & Transition to Afterparty",
    time: "17:50",
  },
  {
    ...DAD,
    kind: "milestone",
    label: "Official Afterparty at the Main Stage Hall",
    time: "18:00",
  },
];
