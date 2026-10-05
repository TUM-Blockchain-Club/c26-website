/**
 * The published conference programme, one entry per session so every event can
 * interleave its sessions chronologically in the same feed. Two of the three
 * days are in: the First Conference Day (October 29, Main, Research and Side
 * Stage) and the Digital Assets Day (October 30, curated by Bundesblock, Main
 * Stage, Executive Forum and Future Stage). Add the Hackathon in between as it
 * is published, keeping the array in chronological order.
 *
 * Everything is generated from the internal agenda exports, one CSV per stage
 * for the first day and one XLS for the Digital Assets Day, not from any
 * public page: Bundesblock's shows "Program in progress" everywhere. Each name
 * in those exports carries its own status, and only the ones marked Confirmed
 * are carried here, so nobody is announced before they have agreed. A session
 * without a confirmed name renders a silhouette and "Speaker to be announced".
 *
 * Where an export writes a placeholder instead of a title, "TBD" or an
 * internal note, the entry carries no title and renders "Title to be
 * announced" rather than repeating the note.
 *
 * Both days are still drafts on the organisers' side and will keep changing.
 *
 * The Digital Assets Day export also lists the closing remarks and the
 * afterparty on all three stages. Those are deliberately left out: they were
 * removed from this agenda once before and should not come back with an
 * update.
 */

export type AgendaEventKey = "conference" | "digital-assets-day" | "hackathon";

/**
 * The three rooms of the venue. Both days use all three and each gives them
 * its own label, so filtering by room has to match either label. Nakamoto is
 * the big one and carries the main programme on both days.
 */
export const ROOMS = [
  {
    room: "Nakamoto",
    labels: { conference: "Nakamoto", "digital-assets-day": "Main Stage" },
  },
  {
    room: "Turing",
    labels: { conference: "Turing", "digital-assets-day": "Executive Forum" },
  },
  {
    room: "Hopper",
    labels: { conference: "Hopper", "digital-assets-day": "Future Stage" },
  },
] as const;

/** Every stage label in use, whichever day it belongs to. */
export const AGENDA_STAGES = ROOMS.flatMap((r) =>
  Object.values(r.labels),
) as readonly string[];

/** The room a stage label belongs to, for filtering across both days. */
export const roomOfStage = (stage?: string) =>
  ROOMS.find((r) => Object.values(r.labels).includes(stage as never))?.room;

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

/** The First Conference Day does not sort its sessions into tracks, so this
 * list is empty; it stays so a day that does can be added without reshaping
 * the filter. */
export const CONFERENCE_TRACKS = [] as const;

export const AGENDA_TRACKS = [...DAD_TRACKS, ...CONFERENCE_TRACKS];

export type AgendaTrackName = (typeof AGENDA_TRACKS)[number]["name"];

type Common = { event: AgendaEventKey; day: string };

export type AgendaEntry =
  | (Common & {
      kind: "talk";
      time: string;
      duration: number; // minutes
      stage: string;
      /** Missing where the programme does not sort the session into a track,
       * which is most of the First Conference Day. */
      track?: AgendaTrackName;
      title?: string; // missing = to be announced
      format?: string;
      /** Only speakers Bundesblock marks as confirmed in the internal agenda;
       * contacted or uncontacted names stay off the site. Missing = none
       * confirmed yet, which renders "Speaker to be announced". */
      speakers?: string[];
      moderator?: string;
    })
  | (Common & {
      // Breaks come straight from the published agenda rather than being
      // inferred from the holes between sessions — each stage breaks at its
      // own time, and some breaks are shorter than any gap heuristic.
      kind: "break";
      time: string;
      duration: number; // minutes
      stage: string;
      label: string;
    })
  | (Common & {
      kind: "milestone";
      label: string;
      time?: string;
      stage?: string;
    });

const TBC: Common = { event: "conference", day: "2026-10-29" };
const DAD: Common = { event: "digital-assets-day", day: "2026-10-30" };
// The venue has three rooms. Each day labels them its own way, so an entry
// carries the label of its own day and ROOMS below ties the two together.
const NAKAMOTO = "Nakamoto";
const TURING = "Turing";
const HOPPER = "Hopper";
const MAIN = "Main Stage";
const FORUM = "Executive Forum";
const FUTURE = "Future Stage";

// Chronological order, then by stage, so the feed reads top to bottom.
export const agendaEntries: AgendaEntry[] = [
  // ---------------------------------------- First Conference Day, Oct 29
  {
    ...TBC,
    kind: "talk",
    time: "09:00",
    duration: 15,
    stage: NAKAMOTO,
    title: "Opening",
    format: "Opening",
    speakers: ["Felix Rihacek"],
  },
  {
    ...TBC,
    kind: "talk",
    time: "09:20",
    duration: 40,
    stage: NAKAMOTO,
    title: "CEX and DEX: Convergence or Competition?",
    format: "Panel",
  },
  {
    ...TBC,
    kind: "talk",
    time: "09:20",
    duration: 25,
    stage: TURING,
    title: "Why the Future of AI Depends on Verifiable Science",
    // The export still has her as Contacted; Felix confirmed her for this one.
    speakers: ["Dr. Sandra Vengadasalam"],
  },
  {
    ...TBC,
    kind: "talk",
    time: "09:20",
    duration: 25,
    stage: HOPPER,
    title: "The Anatomy of a dapp",
    format: "Keynote",
    speakers: ["Václav Pavlín"],
  },
  {
    ...TBC,
    kind: "talk",
    time: "09:50",
    duration: 25,
    stage: TURING,
    title: "Atomic composability in EVM ecosystems and beyond",
    format: "Keynote",
  },
  {
    ...TBC,
    kind: "talk",
    time: "09:50",
    duration: 25,
    stage: HOPPER,
    title: "The Mechanics of Market Manipulation",
    speakers: ["Dr. Nina-Luisa Siedler"],
  },
  {
    ...TBC,
    kind: "talk",
    time: "10:05",
    duration: 40,
    stage: NAKAMOTO,
    title:
      "Hyperscalers Meet Crypto Rails — Cloud Infrastructure for the Machine Economy",
    format: "Panel",
    speakers: ["André Liesenfeld"],
  },
  {
    ...TBC,
    kind: "talk",
    time: "10:20",
    duration: 25,
    stage: TURING,
    title: "Inside Crypto’s Race for Speed",
    format: "Keynote",
  },
  {
    ...TBC,
    kind: "talk",
    time: "10:20",
    duration: 25,
    stage: HOPPER,
    title:
      "The Infrastructure Vulnerability: Key Compromises, Bridge Exploits, and the Limits of Security Audits",
    format: "Keynote",
  },
  {
    ...TBC,
    kind: "talk",
    time: "10:50",
    duration: 40,
    stage: NAKAMOTO,
    title:
      "Technical Regulatory Panel: Autonomous Code Compliance and EU Regulation",
    format: "Panel",
    speakers: ["Billy Rennekamp", "Pawel Grischuk", "Dr. Nina-Luisa Siedler"],
    moderator: "Ondřej Kovařík",
  },
  {
    ...TBC,
    kind: "talk",
    time: "10:50",
    duration: 25,
    stage: TURING,
    title: "Flock: Fast Proving for Batch Boolean Computations",
    speakers: ["William Wang"],
  },
  {
    ...TBC,
    kind: "talk",
    time: "10:50",
    duration: 40,
    stage: HOPPER,
    title: "Identity in a World of Humans and AI",
    format: "Panel",
    speakers: ["Felix Hoops", "Raj"],
  },
  {
    ...TBC,
    kind: "talk",
    time: "11:20",
    duration: 25,
    stage: TURING,
    format: "Keynote",
    speakers: ["Andrew Zitek"],
  },
  {
    ...TBC,
    kind: "talk",
    time: "11:35",
    duration: 40,
    stage: NAKAMOTO,
    title:
      "How Prediction Markets Actually Resolve — Oracles, Disputes & Settlement",
    format: "Panel",
    speakers: ["Jonas Gebele", "Ivan Morozov"],
  },
  {
    ...TBC,
    kind: "talk",
    time: "11:35",
    duration: 40,
    stage: HOPPER,
    title: "AI-Powered Smart Contract Security: From Weeks to Seconds",
    format: "Panel",
  },
  {
    ...TBC,
    kind: "talk",
    time: "11:50",
    duration: 25,
    stage: TURING,
    format: "Keynote",
    speakers: ["Vadim Lyubashevsky"],
  },
  {
    ...TBC,
    kind: "talk",
    time: "12:20",
    duration: 25,
    stage: NAKAMOTO,
    title: "What It Takes to Build an Agent Economy",
    format: "Keynote",
  },
  {
    ...TBC,
    kind: "talk",
    time: "12:20",
    duration: 25,
    stage: TURING,
    format: "Keynote",
    speakers: ["Pavel Hubacek"],
  },
  {
    ...TBC,
    kind: "talk",
    time: "12:20",
    duration: 25,
    stage: HOPPER,
    title:
      "Self-Custody in 2026 — Hardware Wallets After a Year of Record Hacks",
    format: "Panel",
  },
  {
    ...TBC,
    kind: "break",
    time: "12:45",
    duration: 45,
    stage: NAKAMOTO,
    label: "Lunch Break",
  },
  {
    ...TBC,
    kind: "break",
    time: "12:45",
    duration: 45,
    stage: TURING,
    label: "Lunch Break",
  },
  {
    ...TBC,
    kind: "break",
    time: "12:45",
    duration: 45,
    stage: HOPPER,
    label: "Lunch Break",
  },
  {
    ...TBC,
    kind: "talk",
    time: "13:30",
    duration: 40,
    stage: NAKAMOTO,
    title: "Beyond the Hype Cycle: Where Crypto VCs Are Deploying Capital Now",
    format: "Panel",
    speakers: ["Anies Khan", "David An"],
  },
  {
    ...TBC,
    kind: "talk",
    time: "13:30",
    duration: 25,
    stage: TURING,
    title: "How to be Private on a Public Blockchain",
    format: "Keynote",
    speakers: ["Sergey Shemyakov"],
  },
  {
    ...TBC,
    kind: "talk",
    time: "13:30",
    duration: 40,
    stage: HOPPER,
    title: "Learners, Builders, Speculators — Who Is Community For?",
    format: "Panel",
    speakers: ["Andi Schmitt"],
  },
  {
    ...TBC,
    kind: "talk",
    time: "14:00",
    duration: 25,
    stage: TURING,
    title: "Plonk Without Random Oracles",
    format: "Keynote",
    speakers: ["Marek Sefranek"],
  },
  {
    ...TBC,
    kind: "talk",
    time: "14:15",
    duration: 40,
    stage: NAKAMOTO,
    title:
      "Architects of Tomorrow: How Student Innovation is Redefining Industry Standards",
    format: "Keynote",
  },
  {
    ...TBC,
    kind: "talk",
    time: "14:15",
    duration: 25,
    stage: HOPPER,
    title: "The Case for Invisible Infrastructure",
    format: "Keynote",
    speakers: ["Karim Jedda"],
  },
  {
    ...TBC,
    kind: "talk",
    time: "14:30",
    duration: 25,
    stage: TURING,
    title: "Language-Agnostic Detection of Bugs in ZKP Programs",
    format: "Keynote",
    speakers: ["Arman Kolozyan"],
  },
  {
    ...TBC,
    kind: "talk",
    time: "14:45",
    duration: 40,
    stage: HOPPER,
    title: "Tokenize Everything, the Race for Onchain Equities",
    format: "Panel",
  },
  {
    ...TBC,
    kind: "talk",
    time: "15:00",
    duration: 30,
    stage: NAKAMOTO,
    title: "The Future of Privacy on Solana",
    format: "Fireside Chat",
    speakers: ["Tilo Carl Palfner"],
  },
  {
    ...TBC,
    kind: "talk",
    time: "15:00",
    duration: 25,
    stage: TURING,
    speakers: ["Kasra EdalatNejad"],
  },
  {
    ...TBC,
    kind: "talk",
    time: "15:30",
    duration: 25,
    stage: TURING,
    title: "Cryptanalysis of Witness Encryption: A Path to Bitcoin Privacy",
    speakers: ["Markus Schofnegger"],
  },
  {
    ...TBC,
    kind: "talk",
    time: "15:30",
    duration: 25,
    stage: HOPPER,
    title: "DLT Interoperabilität thanks to Open Source",
    format: "Keynote",
  },
  {
    ...TBC,
    kind: "talk",
    time: "15:35",
    duration: 40,
    stage: NAKAMOTO,
    title: "Sovereign Rails vs. Global Giants: Europe’s Payment Infrastructure",
    format: "Panel",
    speakers: ["Sveinn Valfells"],
  },
  {
    ...TBC,
    kind: "talk",
    time: "16:00",
    duration: 25,
    stage: TURING,
    title:
      "The Exotic Derivatives Missing from Blockchain Interest-Rate Markets",
    format: "Keynote",
    speakers: ["Ivan von Greiff"],
  },
  {
    ...TBC,
    kind: "talk",
    time: "16:00",
    duration: 40,
    stage: HOPPER,
    title: "The Agentic Payments Stack",
    format: "Panel",
  },
  {
    ...TBC,
    kind: "talk",
    time: "16:30",
    duration: 25,
    stage: TURING,
    format: "Keynote",
    speakers: ["Dr. Slobodan Sudaric-Hefner"],
  },

  // ------------------------------------------- Digital Assets Day, Oct 30
  {
    ...DAD,
    kind: "break",
    time: "08:00",
    duration: 45,
    stage: MAIN,
    label: "Arrival & Networking",
  },
  {
    ...DAD,
    kind: "talk",
    time: "08:45",
    duration: 15,
    stage: MAIN,
    track: "General Interest",
    title: "Welcome & Opening",
    speakers: ["Daniela Boback", "Sebastian Becker", "Hagen Weiss"],
  },
  {
    ...DAD,
    kind: "talk",
    time: "08:50",
    duration: 45,
    stage: FORUM,
    track: "General Interest",
    title: "Opening Session (Main Stage)",
  },
  {
    ...DAD,
    kind: "talk",
    time: "08:50",
    duration: 55,
    stage: FUTURE,
    track: "General Interest",
    title: "Opening Session (Main Stage)",
  },
  {
    ...DAD,
    kind: "talk",
    time: "09:00",
    duration: 10,
    stage: MAIN,
    track: "General Interest",
    title: "Opening Speech",
  },
  {
    ...DAD,
    kind: "talk",
    time: "09:10",
    duration: 15,
    stage: MAIN,
    track: "General Interest",
    title: "The State of Digital Assets 2026",
    speakers: ["Manfred Richels"],
  },
  {
    ...DAD,
    kind: "talk",
    time: "09:25",
    duration: 20,
    stage: MAIN,
    track: "Policy & Regulation",
    title:
      "A European Digital Assets Strategy? The French-German Task Force on the Future of Financial Markets",
    speakers: ["Christoph Hock"],
    moderator: "Hagen Weiss",
  },
  {
    ...DAD,
    kind: "talk",
    time: "09:35",
    duration: 40,
    stage: FORUM,
    track: "Stablecoins & Payments",
    title: "AI x Blockchain Beyond Payments - Decision-Maker Briefing",
    speakers: ["Silvan Jongerius", "Lukas Beckenbauer"],
  },
  {
    ...DAD,
    kind: "talk",
    time: "09:45",
    duration: 15,
    stage: MAIN,
    track: "Stablecoins & Payments",
    title: "From Digital Euro to Stablecoin Rails - The New Money Stack",
    speakers: ["Franziska Huber"],
  },
  {
    ...DAD,
    kind: "talk",
    time: "10:00",
    duration: 20,
    stage: FUTURE,
    track: "General Interest",
    title: "Digital Product Passport",
  },
  {
    ...DAD,
    kind: "talk",
    time: "10:00",
    duration: 35,
    stage: MAIN,
    track: "Stablecoins & Payments",
    title: "The New Money Stack - what's Europe's positioning",
    speakers: [
      "Claus George",
      "Courtney Lamar Williams",
      "Ramin Ghafari",
      "Henri de Jong",
    ],
    moderator: "Matthias Kröner",
  },
  {
    ...DAD,
    kind: "talk",
    time: "10:15",
    duration: 25,
    stage: FORUM,
    track: "General Interest",
    title:
      "The Race for Value Chain Re-Modelling: How AI & Digital Assets will drive Business Value and Impact",
  },
  {
    ...DAD,
    kind: "talk",
    time: "10:20",
    duration: 30,
    stage: FUTURE,
    track: "General Interest",
    title: "How to manage energy in the future",
    speakers: ["Prof. Thomas Fürstner"],
  },
  {
    ...DAD,
    kind: "break",
    time: "10:35",
    duration: 20,
    stage: MAIN,
    label: "Coffee Break",
  },
  {
    ...DAD,
    kind: "break",
    time: "10:40",
    duration: 20,
    stage: FORUM,
    label: "Coffee-Break",
  },
  {
    ...DAD,
    kind: "break",
    time: "10:50",
    duration: 20,
    stage: FUTURE,
    label: "Coffee-Break",
  },
  {
    ...DAD,
    kind: "talk",
    time: "10:55",
    duration: 15,
    stage: MAIN,
    track: "Digital Capital Markets",
    title: "Portfolio Construction in the Age of Digital Assets",
    speakers: ["Christoph Pliessnig"],
  },
  {
    ...DAD,
    kind: "talk",
    time: "11:00",
    duration: 50,
    stage: FORUM,
    track: "Stablecoins & Payments",
    title:
      "Corporate Treasuries & Agentic AI Payments - must-have Capabilities for the German Economy",
    speakers: ["Claus George", "Valerie von Lucke"],
    moderator: "Prof. Philipp Maume",
  },
  {
    ...DAD,
    kind: "talk",
    time: "11:10",
    duration: 20,
    stage: FUTURE,
    track: "Tokenization & RWA",
    title: "From ERP to Autonomous Enterprises",
  },
  {
    ...DAD,
    kind: "talk",
    time: "11:10",
    duration: 35,
    stage: MAIN,
    track: "Digital Capital Markets",
    title:
      "Capital Markets 2.0 - Digital Securities, Market Infrastructure & Institutional Allocation",
    speakers: [
      "Simone Cortese",
      "Michael Reinhard",
      "Lewin Boehnke",
      "Christian Bock",
    ],
    moderator: "Stefan Grasmann",
  },
  {
    ...DAD,
    kind: "talk",
    time: "11:30",
    duration: 10,
    stage: FUTURE,
    track: "Tokenization & RWA",
    title: "Tokenization & Industry Utility in the Steel Sector",
  },
  {
    ...DAD,
    kind: "talk",
    time: "11:40",
    duration: 10,
    stage: FUTURE,
    track: "Tokenization & RWA",
    title:
      "From the cockpit to the blockchain: How & why an aviation company is building a MiCAR-compliant token",
    speakers: ["Gerhard Wimmer"],
  },
  {
    ...DAD,
    kind: "talk",
    time: "11:45",
    duration: 35,
    stage: MAIN,
    track: "Stablecoins & Payments",
    title:
      "AI x Blockchain Beyond Payments - Agents, Data Markets & Trusted Automation",
    speakers: ["Jens Strüker", "Patrick Tobler", "Andre Liesenfeld"],
    moderator: "Sarah Gottwald",
  },
  {
    ...DAD,
    kind: "talk",
    time: "11:50",
    duration: 45,
    stage: FUTURE,
    track: "Tokenization & RWA",
    title: "The programmable Company",
    speakers: ["Jürgen Kleeberger", "Christoph Jentzsch"],
  },
  {
    ...DAD,
    kind: "talk",
    time: "11:55",
    duration: 50,
    stage: FORUM,
    track: "Digital Capital Markets",
    title: "Portfolio Construction & Institutional Allocation",
    speakers: [
      "Marcel Uhlmann",
      "Ralf Kubli",
      "Christian Bock",
      "Hannes Claut",
    ],
    moderator: "Daniela Boback",
  },
  {
    ...DAD,
    kind: "break",
    time: "12:20",
    duration: 55,
    stage: MAIN,
    label: "Lunch Break",
  },
  {
    ...DAD,
    kind: "break",
    time: "12:35",
    duration: 50,
    stage: FUTURE,
    label: "Lunch-Break",
  },
  {
    ...DAD,
    kind: "break",
    time: "12:45",
    duration: 45,
    stage: FORUM,
    label: "Lunch Break",
  },
  {
    ...DAD,
    kind: "talk",
    time: "13:15",
    duration: 20,
    stage: MAIN,
    track: "Tokenization & RWA",
    title: "Tokenization & the Road to Real World Influence",
  },
  {
    ...DAD,
    kind: "talk",
    time: "13:25",
    duration: 10,
    stage: FUTURE,
    track: "Institutional Trust Infrastructure",
    title: "AI & Blockchain: Trust Design & the AI Act",
  },
  {
    ...DAD,
    kind: "talk",
    time: "13:30",
    duration: 30,
    stage: FORUM,
    track: "Digital Capital Markets",
    title: "European Banking Consortia driving Digital Capital Markets",
    speakers: ["Michael Cyrus"],
  },
  {
    ...DAD,
    kind: "talk",
    time: "13:35",
    duration: 20,
    stage: FUTURE,
    track: "Institutional Trust Infrastructure",
    title: "How to Manage Europe's Production Data Layer",
  },
  {
    ...DAD,
    kind: "talk",
    time: "13:35",
    duration: 40,
    stage: MAIN,
    track: "Tokenization & RWA",
    title: "What should be Tokenized First?",
    speakers: [
      "Raphael Neuberger",
      "Moritz Stumpf",
      "Lorenzo Rigatti",
      "Christian Million",
    ],
    moderator: "Jessica Kreysar",
  },
  {
    ...DAD,
    kind: "talk",
    time: "13:55",
    duration: 45,
    stage: FUTURE,
    track: "Institutional Trust Infrastructure",
    title:
      "All ways lead to Rome: Pontes, Appia & the necessary marriage of financial & technical sovereignty",
    speakers: ["Dolf Diederichsen"],
  },
  {
    ...DAD,
    kind: "talk",
    time: "14:05",
    duration: 15,
    stage: FORUM,
    track: "Tokenization & RWA",
    title:
      "From Tokenization to Allocation: How Institutions Evaluate On-Chain Real-World Assets",
  },
  {
    ...DAD,
    kind: "talk",
    time: "14:15",
    duration: 25,
    stage: MAIN,
    track: "Policy & Regulation",
    title:
      "Regulation, Tax & Competitiveness - MiCA 2.0, DAC8, DORA and beyond",
    speakers: ["Alireza Siadat"],
    moderator: "Dr. Nina-Luisa Siedler",
  },
  {
    ...DAD,
    kind: "talk",
    time: "14:20",
    duration: 55,
    stage: FORUM,
    track: "Tokenization & RWA",
    title: "Tokenization Deep Dive - Assets, Adoption & Distribution",
    speakers: [
      "Daniel Wernicke",
      "Markus Kluge",
      "Raphael Neuberger",
      "Christoph Jentzsch",
    ],
  },
  {
    ...DAD,
    kind: "talk",
    time: "14:40",
    duration: 45,
    stage: FUTURE,
    track: "Digital Capital Markets",
    title: "Leaders vs. Laggards: Financial Institutions of the Future",
    speakers: ["David Kurz", "Mykolas Majauskas"],
  },
  {
    ...DAD,
    kind: "talk",
    time: "14:40",
    duration: 15,
    stage: MAIN,
    track: "Institutional Trust Infrastructure",
    title: "Institutional Trust Infrastructure - What enables Trust?",
  },
  {
    ...DAD,
    kind: "talk",
    time: "14:55",
    duration: 35,
    stage: MAIN,
    track: "Institutional Trust Infrastructure",
    title: "Scaling Institutional Trust: Custody, Wallets, Identity & Security",
    speakers: ["Martin Kreitmair", "Niclas Voigt"],
    moderator: "Oliver Naegele",
  },
  {
    ...DAD,
    kind: "break",
    time: "15:20",
    duration: 20,
    stage: FORUM,
    label: "Coffee Break",
  },
  {
    ...DAD,
    kind: "break",
    time: "15:25",
    duration: 25,
    stage: FUTURE,
    label: "Coffee-Break",
  },
  {
    ...DAD,
    kind: "break",
    time: "15:30",
    duration: 20,
    stage: MAIN,
    label: "Coffee Break",
  },
  {
    ...DAD,
    kind: "talk",
    time: "15:40",
    duration: 30,
    stage: FORUM,
    track: "General Interest",
    title: "The Innovation Challenge - a Call to Action",
    speakers: ["Alexander Höptner"],
  },
  {
    ...DAD,
    kind: "talk",
    time: "15:50",
    duration: 10,
    stage: FUTURE,
    track: "General Interest",
  },
  {
    ...DAD,
    kind: "talk",
    time: "15:50",
    duration: 25,
    stage: MAIN,
    track: "General Interest",
    title: "How to Collaborate: Industry x Blockchain Foundations",
    speakers: ["Patricia Albrecht", "Fabian Bormann"],
    moderator: "Sebastian Becker",
  },
  {
    ...DAD,
    kind: "talk",
    time: "16:00",
    duration: 20,
    stage: FUTURE,
    track: "General Interest",
    title:
      "Bridging the crypto Language gap - how Technology, Institutions and Regulators can understand each other",
    speakers: ["Afra Stöhr", "Pavlina Pavlova"],
  },
  {
    ...DAD,
    kind: "talk",
    time: "16:15",
    duration: 50,
    stage: FORUM,
    track: "Institutional Trust Infrastructure",
    title:
      "Trust Infrastructure for Institutions - Custody, Wallets, Identity & Compliance",
    speakers: ["Lewin Boehnke", "Niclas Voigt"],
  },
  {
    ...DAD,
    kind: "talk",
    time: "16:15",
    duration: 20,
    stage: MAIN,
    track: "Institutional Trust Infrastructure",
    title:
      "Digital Public Infrastructure - EU Business Wallet, Deutschland Stack & Sovereignty",
    speakers: ["Jens Strüker"],
  },
  {
    ...DAD,
    kind: "talk",
    time: "16:20",
    duration: 45,
    stage: FUTURE,
    track: "General Interest",
    title:
      "A strategic look at the Crypto Taxation Debate in Germany & Austria",
    speakers: ["Marie Christin Rinke", "Florian Wimmer"],
    moderator: "Paul Pöltner",
  },
  {
    ...DAD,
    kind: "talk",
    time: "16:35",
    duration: 20,
    stage: MAIN,
    track: "Policy & Regulation",
    title:
      "European Champions: Forming Future Financial Players in the German-speaking Markets",
    speakers: ["Lewin Boehnke", "Michael Reinhard"],
  },
  {
    ...DAD,
    kind: "talk",
    time: "16:55",
    duration: 35,
    stage: MAIN,
    track: "General Interest",
    title: "Society 2035 - AI, Digital Assets & our Future Economic Backend",
    moderator: "Max Muth",
  },
  {
    ...DAD,
    kind: "talk",
    time: "17:10",
    duration: 35,
    stage: FORUM,
    track: "Digital Capital Markets",
    title:
      "Rewiring of Financial Market Infrastructure & the vision for a Deutschland AG 2.0",
    speakers: ["Oliver Naegele"],
  },
  {
    ...DAD,
    kind: "talk",
    time: "17:30",
    duration: 25,
    stage: MAIN,
    track: "General Interest",
    title: "The Race for international Digital Assets Leadership",
  },
];
