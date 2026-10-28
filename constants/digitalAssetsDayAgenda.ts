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
 * Every talk carries a hand-assigned `id` that is its shareable link,
 * /agenda/<id>. When updating from a new export, keep each session's id even
 * if its title, time or stage changed, and give new sessions a new one.
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
    room: "Nakamoto Stage",
    labels: {
      conference: "Nakamoto Stage",
      "digital-assets-day": "Main Stage",
    },
  },
  {
    room: "Turing Stage",
    labels: {
      conference: "Turing Stage",
      "digital-assets-day": "Executive Forum",
    },
  },
  {
    room: "Hopper Stage",
    labels: {
      conference: "Hopper Stage",
      "digital-assets-day": "Future Stage",
    },
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
    hex: "#4285f4",
    dot: "bg-[#4285f4]",
    accent: "border-[#4285f4]",
    active: "border-[#4285f4] bg-[#4285f4]/15 text-white",
  },
  {
    name: "Stablecoins & Payments",
    hex: "#f5f52c",
    dot: "bg-[#f5f52c]",
    accent: "border-[#f5f52c]",
    active: "border-[#f5f52c] bg-[#f5f52c]/15 text-white",
  },
  {
    name: "Policy & Regulation",
    hex: "#ff9447",
    dot: "bg-[#ff9447]",
    accent: "border-[#ff9447]",
    active: "border-[#ff9447] bg-[#ff9447]/15 text-white",
  },
  {
    name: "Tokenization & RWA",
    hex: "#5ccc7a",
    dot: "bg-[#5ccc7a]",
    accent: "border-[#5ccc7a]",
    active: "border-[#5ccc7a] bg-[#5ccc7a]/15 text-white",
  },
  {
    name: "Institutional Trust Infrastructure",
    hex: "#a64d79",
    dot: "bg-[#a64d79]",
    accent: "border-[#a64d79]",
    active: "border-[#a64d79] bg-[#a64d79]/15 text-white",
  },
  {
    name: "General Interest",
    hex: "#d9d9d9",
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
      /** The session's permanent link, /agenda/<id>. Assigned once and kept
       * when the exports are re-imported, even if the title, time or stage
       * changes, because shared links on social media point at it. Never
       * reuse an id for a different session. */
      id: string;
      time: string;
      /** Minutes. Missing where the programme gives only a start time, as
       * the Hackathon does for its ceremonies; the session then shows its
       * start alone. */
      duration?: number;
      /** The slot is planned but its time is not confirmed yet ("Time TBA"). */
      timeTba?: boolean;
      /** Empty where the programme names no room. */
      stage: string;
      /** Missing where the programme does not sort the session into a track,
       * which is most of the First Conference Day. */
      track?: AgendaTrackName;
      title?: string; // missing = to be announced
      /** The abstract, as plain text. Only Strapi carries one; panels have
       * none, and a session without it shows nothing in its place. */
      description?: string;
      format?: string;
      /** Only speakers Bundesblock marks as confirmed in the internal agenda;
       * contacted or uncontacted names stay off the site. Missing = none
       * confirmed yet, which renders "Speaker to be announced". */
      speakers?: string[];
      moderator?: string;
      /** Slides uploaded on the session in Strapi, in their order. `size` is
       * in kB; `pdf` is the PDF the convert-slides workflow made of a
       * PowerPoint, Keynote or ODP file, once there is one. */
      slides?: {
        src: string;
        mime: string;
        name: string;
        hash?: string;
        size?: number;
        pdf?: string;
      }[];
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
const NAKAMOTO = "Nakamoto Stage";
const TURING = "Turing Stage";
const HOPPER = "Hopper Stage";
const MAIN = "Main Stage";
const FORUM = "Executive Forum";
const FUTURE = "Future Stage";

// Chronological order, then by stage, so the feed reads top to bottom.
export const agendaEntries: AgendaEntry[] = [
  // ---------------------------------------- First Conference Day, Oct 29
  {
    ...TBC,
    kind: "talk",
    id: "conference-opening",
    time: "09:00",
    duration: 15,
    stage: NAKAMOTO,
    title: "TUM Blockchain Conference 2026 Opening",
    format: "Opening",
    speakers: ["Felix Rihacek"],
  },
  {
    ...TBC,
    kind: "talk",
    id: "cex-and-dex",
    time: "09:20",
    duration: 40,
    stage: NAKAMOTO,
    title: "CEX and DEX: Convergence or Competition?",
    format: "Panel",
    speakers: ["Per Möller", "Julian Ullrich"],
  },
  {
    ...TBC,
    kind: "talk",
    id: "future-of-ai-verifiable-science",
    time: "09:20",
    duration: 25,
    stage: TURING,
    title: "Why the Future of AI Depends on Verifiable Science",
    speakers: ["Dr. Sandra Vengadasalam"],
  },
  {
    ...TBC,
    kind: "talk",
    id: "the-anatomy-of-a-dapp",
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
    id: "atomic-composability-evm",
    time: "09:50",
    duration: 25,
    stage: TURING,
    title: "Atomic composability in EVM ecosystems and beyond",
    format: "Keynote",
    speakers: ["Norbert Vadas"],
  },
  {
    ...TBC,
    kind: "talk",
    id: "the-mechanics-of-market-manipulation",
    time: "09:50",
    duration: 25,
    stage: HOPPER,
    title: "The Mechanics of Market Manipulation",
    speakers: ["Dr. Nina-Luisa Siedler"],
  },
  {
    ...TBC,
    kind: "talk",
    id: "hyperscalers-meet-crypto-rails",
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
    id: "arkworks-pq-merkle-commitments",
    time: "10:20",
    duration: 25,
    stage: TURING,
    title: "Arkworks PQ + Merkle Commitments",
    speakers: ["Andrew Zitek-Estrada"],
  },
  {
    ...TBC,
    kind: "talk",
    id: "inside-cryptos-race-for-speed",
    time: "10:20",
    duration: 25,
    stage: HOPPER,
    title: "Inside Crypto’s Race for Speed",
    format: "Keynote",
    speakers: ["Shouvik Ghosh"],
  },
  {
    ...TBC,
    kind: "talk",
    id: "technical-regulatory-panel",
    time: "10:50",
    duration: 40,
    stage: NAKAMOTO,
    title:
      "Technical Regulatory Panel: Autonomous Code Compliance and EU Regulation",
    format: "Panel",
    speakers: ["Billy Rennekamp", "Dr. Nina-Luisa Siedler"],
    moderator: "Ondřej Kovařík",
  },
  {
    ...TBC,
    kind: "talk",
    id: "day1-turing-1050",
    time: "10:50",
    duration: 25,
    stage: TURING,
    speakers: ["Chen-Da Liu-Zhang"],
  },
  {
    ...TBC,
    kind: "talk",
    id: "the-infrastructure-vulnerability",
    time: "10:50",
    duration: 25,
    stage: HOPPER,
    title:
      "The Infrastructure Vulnerability: Key Compromises, Bridge Exploits, and the Limits of Security Audits",
    format: "Keynote",
    speakers: ["Tarkan Yavas"],
  },
  {
    ...TBC,
    kind: "talk",
    id: "day1-turing-1120",
    time: "11:20",
    duration: 25,
    stage: TURING,
    format: "Keynote",
    speakers: ["Vadim Lyubashevsky"],
  },
  {
    ...TBC,
    kind: "talk",
    id: "identity-humans-and-ai",
    time: "11:20",
    duration: 40,
    stage: HOPPER,
    title: "Identity in a World of Humans and AI",
    format: "Panel",
    speakers: ["Felix Hoops", "Raj Patil"],
    moderator: "Irfan Khan",
  },
  {
    ...TBC,
    kind: "talk",
    id: "how-prediction-markets-actually-resolve",
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
    id: "day1-turing-1150",
    time: "11:50",
    duration: 25,
    stage: TURING,
    format: "Keynote",
    speakers: ["Pavel Hubacek"],
  },
  {
    ...TBC,
    kind: "talk",
    id: "learners-builders-speculators",
    time: "12:05",
    duration: 40,
    stage: HOPPER,
    title: "Learners, Builders, Speculators — Who Is Community For?",
    format: "Panel",
    speakers: ["Andi Schmitt", "Carlo"],
  },
  {
    ...TBC,
    kind: "talk",
    id: "agent-economy",
    time: "12:20",
    duration: 25,
    stage: NAKAMOTO,
    title: "What It Takes to Build an Agent Economy",
    format: "Keynote",
  },
  {
    ...TBC,
    kind: "talk",
    id: "private-on-a-public-blockchain",
    time: "12:20",
    duration: 25,
    stage: TURING,
    title: "How to be Private on a Public Blockchain",
    format: "Keynote",
    speakers: ["Sergey Shemyakov"],
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
    id: "beyond-the-hype-cycle",
    time: "13:30",
    duration: 40,
    stage: NAKAMOTO,
    title: "Beyond the Hype Cycle: Where Crypto VCs Are Deploying Capital Now",
    format: "Panel",
    speakers: ["Anies Khan", "Dr. David An"],
  },
  {
    ...TBC,
    kind: "talk",
    id: "plonk-without-random-oracles",
    time: "13:35",
    duration: 25,
    stage: TURING,
    title: "Plonk Without Random Oracles",
    format: "Keynote",
    speakers: ["Marek Sefranek"],
  },
  {
    ...TBC,
    kind: "talk",
    id: "self-custody-in-2026",
    time: "13:35",
    duration: 25,
    stage: HOPPER,
    title:
      "Self-Custody in 2026 — Hardware Wallets After a Year of Record Hacks",
    format: "Executive Talk",
    speakers: ["Nikita Eriashev"],
  },
  {
    ...TBC,
    kind: "talk",
    id: "bugs-in-zkp-programs",
    time: "14:05",
    duration: 25,
    stage: TURING,
    title: "Language-Agnostic Detection of Bugs in ZKP Programs",
    format: "Keynote",
    speakers: ["Arman Kolozyan"],
  },
  {
    ...TBC,
    kind: "talk",
    id: "tokenize-everything",
    time: "14:05",
    duration: 40,
    stage: HOPPER,
    title:
      "Tokenize Everything — Ondo, xStocks, Paxos & the Race for Onchain Equities",
    format: "Panel",
  },
  {
    ...TBC,
    kind: "talk",
    id: "architects-of-tomorrow",
    time: "14:15",
    duration: 40,
    stage: NAKAMOTO,
    title:
      "Architects of Tomorrow: How Student Innovation is Redefining Industry Standards",
    format: "Keynote",
    speakers: ["Gopi Mehta"],
  },
  {
    ...TBC,
    kind: "talk",
    id: "flock",
    time: "14:35",
    duration: 25,
    stage: TURING,
    title: "Flock: Flock: Fast Proving for Batch Boolean Computations",
    speakers: ["William Wang"],
  },
  {
    ...TBC,
    kind: "talk",
    id: "sovereign-rails-vs-global-giants",
    time: "14:50",
    duration: 40,
    stage: HOPPER,
    title: "Sovereign Rails vs. Global Giants: Europe’s Payment Infrastructure",
    format: "Panel",
    speakers: ["Sveinn Valfells"],
  },
  {
    ...TBC,
    kind: "talk",
    id: "1inch-aqua",
    time: "15:00",
    duration: 25,
    stage: NAKAMOTO,
    title: "1inch Aqua: How Shared Liquidity Unlocks Capital Efficiency",
    format: "Keynote",
    speakers: ["Vadim Fadeev"],
  },
  {
    ...TBC,
    kind: "talk",
    id: "cryptanalysis-of-witness-encryption",
    time: "15:05",
    duration: 25,
    stage: TURING,
    title: "Cryptanalysis of Witness Encryption: A Path to Bitcoin Privacy",
    speakers: ["Markus Schofnegger"],
  },
  {
    ...TBC,
    kind: "talk",
    id: "the-future-of-privacy-on-solana",
    time: "15:30",
    duration: 30,
    stage: NAKAMOTO,
    title: "The Future of Privacy on Solana",
    format: "Fireside Chat",
    speakers: ["Tilo Carl Palfner"],
  },
  {
    ...TBC,
    kind: "talk",
    id: "track-me-if-you-can",
    time: "15:35",
    duration: 25,
    stage: TURING,
    title: "Track me if you can: Ephemeral coin tracing",
    speakers: ["François-Xavier Wicht"],
  },
  {
    ...TBC,
    kind: "talk",
    id: "people-use-products",
    time: "15:35",
    duration: 25,
    stage: HOPPER,
    title: "People don't use Technology, They Use Products...",
    format: "Keynote",
    speakers: ["Karim Jedda"],
  },
  {
    ...TBC,
    kind: "talk",
    id: "ai-powered-smart-contract-security",
    time: "16:05",
    duration: 40,
    stage: NAKAMOTO,
    title: "AI-Powered Smart Contract Security: From Weeks to Seconds",
    format: "Panel",
    speakers: ["Sebastian Banescu", "Yannik Heinze"],
  },
  {
    ...TBC,
    kind: "talk",
    id: "the-floor-that-keeps-moving",
    time: "16:05",
    duration: 25,
    stage: TURING,
    title:
      "The Floor That Keeps Moving: Six Months of Breaking ECDSA on a Public Benchmark",
    speakers: ["Gopi Kannappan"],
  },
  {
    ...TBC,
    kind: "talk",
    id: "dlt-interoperability-open-source",
    time: "16:05",
    duration: 25,
    stage: HOPPER,
    title: "DLT Interoperabilität thanks to Open Source",
    format: "Keynote",
  },
  {
    ...TBC,
    kind: "talk",
    id: "day1-turing-1635",
    time: "16:35",
    duration: 25,
    stage: TURING,
    format: "Keynote",
    speakers: ["Dr. Slobodan Sudaric-Hefner"],
  },
  {
    ...TBC,
    kind: "talk",
    id: "exotic-interest-rate-derivatives",
    time: "16:35",
    duration: 25,
    stage: HOPPER,
    title:
      "The Exotic Derivatives Missing from Blockchain Interest-Rate Markets",
    format: "Keynote",
    speakers: ["Ivan von Greiff"],
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
    id: "dad-welcome-and-opening",
    time: "08:45",
    duration: 15,
    stage: MAIN,
    track: "General Interest",
    title: "Welcome & Opening",
    speakers: [
      "Daniela Boback",
      "Sebastian Becker",
      "Hagen Weiss",
      "Florian Haller",
    ],
  },
  {
    ...DAD,
    kind: "talk",
    id: "opening-session-executive-forum",
    time: "08:50",
    duration: 45,
    stage: FORUM,
    track: "General Interest",
    title: "Opening Session (Main Stage)",
  },
  {
    ...DAD,
    kind: "talk",
    id: "opening-session-future-stage",
    time: "08:50",
    duration: 55,
    stage: FUTURE,
    track: "General Interest",
    title: "Opening Session (Main Stage)",
  },
  {
    ...DAD,
    kind: "talk",
    id: "dad-opening-speech",
    time: "09:00",
    duration: 10,
    stage: MAIN,
    track: "General Interest",
    title: "Opening Speech",
    speakers: ["Florian Haller"],
  },
  {
    ...DAD,
    kind: "talk",
    id: "the-state-of-digital-assets-2026",
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
    id: "a-european-digital-assets-strategy",
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
    id: "ai-x-blockchain-decision-maker-briefing",
    time: "09:35",
    duration: 40,
    stage: FORUM,
    track: "General Interest",
    title: "AI x Blockchain Beyond Payments - Decision-Maker Briefing",
    speakers: ["Peter Busch", "Silvan Jongerius", "Lukas Beckenbauer"],
  },
  {
    ...DAD,
    kind: "talk",
    id: "from-digital-euro-to-stablecoin-rails",
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
    id: "digital-product-passport",
    time: "10:00",
    duration: 20,
    stage: FUTURE,
    track: "General Interest",
    title: "Digital Product Passport",
    speakers: ["Asgeir Oskarsson"],
  },
  {
    ...DAD,
    kind: "talk",
    id: "the-new-money-stack",
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
    id: "value-chain-re-modelling",
    time: "10:15",
    duration: 25,
    stage: FORUM,
    track: "General Interest",
    title:
      "The Race for Value Chain Re-Modelling: How AI & Digital Assets will drive Business Value and Impact",
    speakers: ["Prof. Eduard Grün"],
  },
  {
    ...DAD,
    kind: "talk",
    id: "managing-energy-in-the-future",
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
    id: "portfolio-construction-digital-assets",
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
    id: "corporate-treasuries-and-agentic-ai-payments",
    time: "11:00",
    duration: 50,
    stage: FORUM,
    track: "Stablecoins & Payments",
    title:
      "Corporate Treasuries & Agentic AI Payments - must-have Capabilities for the German Economy",
    speakers: [
      "Claus George",
      "Valerie von Lucke",
      "Bernhard Schweizer",
      "Paul Wong",
    ],
    moderator: "Prof. Philipp Maume",
  },
  {
    ...DAD,
    kind: "talk",
    id: "from-erp-to-autonomous-enterprises",
    time: "11:10",
    duration: 20,
    stage: FUTURE,
    track: "Tokenization & RWA",
    title: "From ERP to Autonomous Enterprises",
  },
  {
    ...DAD,
    kind: "talk",
    id: "capital-markets-2-0",
    time: "11:10",
    duration: 35,
    stage: MAIN,
    track: "Digital Capital Markets",
    title: "Capital Markets 2.0 - Digital Securities & Market Infrastructure",
    speakers: ["Simone Cortese", "Michael Reinhard", "Christian Bock"],
    moderator: "Stefan Grasmann",
  },
  {
    ...DAD,
    kind: "talk",
    id: "tokenization-steel-sector",
    time: "11:30",
    duration: 10,
    stage: FUTURE,
    track: "Tokenization & RWA",
    title: "Tokenization & Industry Utility in the Steel Sector",
    speakers: ["Tobias Rethmeyer"],
  },
  {
    ...DAD,
    kind: "talk",
    id: "from-the-cockpit-to-the-blockchain",
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
    id: "ai-x-blockchain-agents-data-markets",
    time: "11:45",
    duration: 35,
    stage: MAIN,
    track: "General Interest",
    title:
      "AI x Blockchain Beyond Payments - Agents, Data Markets & Trusted Automation",
    // The XLS spells him Isenman; Bundesblock's own published agenda has the
    // second n, and that page is the newer source.
    speakers: ["Jens Strüker", "Andre Liesenfeld", "Phil Isenmann"],
    moderator: "Sarah Gottwald",
  },
  {
    ...DAD,
    kind: "talk",
    id: "portfolio-construction-and-institutional-allocation",
    time: "11:50",
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
    kind: "talk",
    id: "the-programmable-company",
    time: "11:50",
    duration: 40,
    stage: FUTURE,
    track: "Tokenization & RWA",
    title: "The programmable Company",
    // The export writes him as "Jan-Gero Hannemann"; his own submission has
    // the middle name, and the portrait only joins on an exact match.
    speakers: [
      "Jürgen Kleeberger",
      "Christoph Jentzsch",
      "Jan-Gero Alexander Hannemann",
    ],
    moderator: "Radoslav Albrecht",
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
    kind: "talk",
    id: "x402-m2m-payments",
    time: "12:30",
    duration: 20,
    stage: FUTURE,
    track: "Stablecoins & Payments",
    title: "x402 - M2M Payments",
  },
  {
    ...DAD,
    kind: "break",
    time: "12:40",
    duration: 45,
    stage: FORUM,
    label: "Lunch Break",
  },
  {
    ...DAD,
    kind: "break",
    time: "12:50",
    duration: 35,
    stage: FUTURE,
    label: "Lunch-Break",
  },
  {
    ...DAD,
    kind: "talk",
    id: "tokenization-real-world-influence",
    time: "13:15",
    duration: 20,
    stage: MAIN,
    track: "Tokenization & RWA",
    title: "Tokenization & the Road to Real World Influence",
  },
  {
    ...DAD,
    kind: "talk",
    id: "european-banking-consortia",
    time: "13:25",
    duration: 30,
    stage: FORUM,
    track: "Digital Capital Markets",
    title: "European Banking Consortia driving Digital Capital Markets",
    speakers: ["Michael Cyrus"],
  },
  {
    ...DAD,
    kind: "talk",
    id: "ai-act-trust-design",
    time: "13:25",
    duration: 10,
    stage: FUTURE,
    track: "Institutional Trust Infrastructure",
    title: "AI & Blockchain: Trust Design & the AI Act",
  },
  {
    ...DAD,
    kind: "talk",
    id: "europes-production-data-layer",
    time: "13:35",
    duration: 20,
    stage: FUTURE,
    track: "Institutional Trust Infrastructure",
    title: "How to Manage & Settle Europe's Production Data Layer",
  },
  {
    ...DAD,
    kind: "talk",
    id: "what-should-be-tokenized-first",
    time: "13:35",
    duration: 40,
    stage: MAIN,
    track: "Tokenization & RWA",
    title: "What should be Tokenized First?",
    speakers: [
      "Raphael Neuberger",
      "Lorenzo Rigatti",
      "Christian Million",
      "Moritz Stumpf",
    ],
    moderator: "Jessica Kreysar",
  },
  {
    ...DAD,
    kind: "talk",
    id: "the-innovation-challenge",
    time: "13:55",
    duration: 25,
    stage: FORUM,
    track: "General Interest",
    title: "The Innovation Challenge - a Call to Action",
    speakers: ["Alexander Höptner"],
  },
  {
    ...DAD,
    kind: "talk",
    id: "all-ways-lead-to-rome",
    time: "13:55",
    duration: 45,
    stage: FUTURE,
    track: "Institutional Trust Infrastructure",
    title:
      "All ways lead to Rome: Pontes, Appia & the necessary marriage of financial & technical sovereignty",
    speakers: ["Jens Paulsen", "Dolf Diederichsen", "Jork Leonhardt"],
  },
  {
    ...DAD,
    kind: "talk",
    id: "european-champions",
    time: "14:15",
    duration: 25,
    stage: MAIN,
    track: "Policy & Regulation",
    title:
      "European Champions: Forming Future Financial Players in the German-speaking Markets",
    speakers: ["Lewin Boehnke", "Michael Reinhard"],
    moderator: "Oliver Schmitt",
  },
  {
    ...DAD,
    kind: "talk",
    id: "tokenization-deep-dive",
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
    id: "leaders-vs-laggards",
    time: "14:40",
    duration: 45,
    stage: FUTURE,
    track: "Digital Capital Markets",
    title: "Leaders vs. Laggards: Financial Institutions of the Future",
    speakers: ["David Kurz", "Charles Moussy", "Marco Bodewein"],
    moderator: "Alireza Siadat",
  },
  {
    ...DAD,
    kind: "talk",
    id: "institutional-trust-infrastructure",
    time: "14:40",
    duration: 15,
    stage: MAIN,
    track: "Institutional Trust Infrastructure",
    title: "Institutional Trust Infrastructure - What enables Trust?",
    speakers: ["Jacek Trzmiel"],
    moderator: "Sebastian Becker",
  },
  {
    ...DAD,
    kind: "talk",
    id: "scaling-institutional-trust",
    time: "14:55",
    duration: 35,
    stage: MAIN,
    track: "Institutional Trust Infrastructure",
    title: "Scaling Institutional Trust: Custody, Wallets, Identity & Security",
    speakers: ["Martin Kreitmair", "Niclas Voigt", "Jonas Gantenbein"],
    moderator: "Oliver Naegele",
  },
  {
    ...DAD,
    kind: "break",
    time: "15:15",
    duration: 25,
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
    id: "from-tokenization-to-allocation",
    time: "15:40",
    duration: 20,
    stage: FORUM,
    track: "Tokenization & RWA",
    title:
      "From Tokenization to Allocation: How Institutions Evaluate On-Chain Real-World Assets",
  },
  {
    ...DAD,
    kind: "talk",
    id: "day2-future-stage-1550",
    time: "15:50",
    duration: 10,
    stage: FUTURE,
    track: "General Interest",
  },
  {
    ...DAD,
    kind: "talk",
    id: "how-to-collaborate",
    time: "15:50",
    duration: 25,
    stage: MAIN,
    track: "General Interest",
    title: "How to Collaborate: Industry x Blockchain Foundations",
    speakers: ["Patricia Albrecht", "Fabian Bormann", "Heinz-Günther Lux"],
    moderator: "Sebastian Becker",
  },
  {
    ...DAD,
    kind: "talk",
    id: "bridging-the-crypto-language-gap",
    time: "16:00",
    duration: 20,
    stage: FUTURE,
    track: "General Interest",
    title:
      "Bridging the crypto Language gap - how Technology, Institutions and Regulators can understand each other",
    speakers: ["Afra Stöhr"],
  },
  {
    ...DAD,
    kind: "talk",
    id: "trust-infrastructure-for-institutions",
    time: "16:05",
    duration: 55,
    stage: FORUM,
    track: "Institutional Trust Infrastructure",
    title:
      "Trust Infrastructure for Institutions - Custody, Wallets, Identity & Compliance",
    speakers: [
      "Lewin Boehnke",
      "Niclas Voigt",
      "Dr. Thomas Endress",
      "Alexandra Lloyd",
    ],
  },
  {
    ...DAD,
    kind: "talk",
    id: "digital-public-infrastructure",
    time: "16:15",
    duration: 20,
    stage: MAIN,
    track: "Institutional Trust Infrastructure",
    title:
      "Digital Public Infrastructure - EU Business Wallet, Deutschland Stack & European Sovereignty",
    speakers: ["Jens Strüker", "Jacek Trzmiel"],
  },
  {
    ...DAD,
    kind: "talk",
    id: "crypto-taxation-germany-austria",
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
    id: "regulation-tax-and-competitiveness",
    time: "16:35",
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
    id: "rewiring-financial-market-infrastructure",
    time: "17:00",
    duration: 35,
    stage: FORUM,
    track: "Digital Capital Markets",
    title:
      "Rewiring of Financial Market Infrastructure & the vision for a Deutschland AG 2.0",
    speakers: ["Oliver Naegele", "Robert Heinze"],
    moderator: "Hagen Weiss",
  },
  {
    ...DAD,
    kind: "talk",
    id: "society-2035",
    time: "17:00",
    duration: 35,
    stage: MAIN,
    track: "General Interest",
    title: "Society 2035 - AI, Digital Assets & our Future Economic Backend",
    // The export writes "Dmytro Budorin"; his own submission says Dyma, and
    // the portrait joins on an exact match.
    speakers: ["Stephan Lutz", "Dyma Budorin"],
    moderator: "Max Muth",
  },
  {
    ...DAD,
    kind: "talk",
    id: "international-digital-assets-leadership",
    time: "17:35",
    duration: 25,
    stage: MAIN,
    track: "General Interest",
    title: "The Race for international Digital Assets Leadership",
  },
];

export type AgendaTalk = Extract<AgendaEntry, { kind: "talk" }>;

/** Every talk, in programme order. */
export const agendaTalks = agendaEntries.filter(
  (e): e is AgendaTalk => e.kind === "talk",
);

const TALKS_BY_ID = new Map(agendaTalks.map((t) => [t.id, t]));
// A duplicated id would make two sessions share one link, so fail the build
// rather than let the second one silently disappear.
if (TALKS_BY_ID.size !== agendaTalks.length) {
  const seen = new Set<string>();
  const dupes = agendaTalks.filter((t) => seen.size === seen.add(t.id).size);
  throw new Error(
    `Duplicate agenda session ids: ${dupes.map((t) => t.id).join(", ")}`,
  );
}

export const talkById = (id: string): AgendaTalk | undefined =>
  TALKS_BY_ID.get(id);
