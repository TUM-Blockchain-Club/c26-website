/**
 * The published conference programme, one entry per session so every event can
 * interleave its sessions chronologically in the same feed. So far only the
 * Digital Assets Day (Day 2, October 30, 2026, curated by Bundesblock) is
 * announced; add First Conference Day and Hackathon sessions in between as
 * they are published, keeping the array in chronological order.
 *
 * The Digital Assets Day entries mirror Bundesblock's own published agenda
 * (bundesblock.de/dad-agenda) one to one: three stages, the same titles, times
 * and focus tracks. It is still a draft on their side and will keep changing.
 *
 * Times, titles, stages, tracks and names are generated from the internal
 * agenda export Bundesblock sends (`internal-agenda.xls`), not from their
 * public page, which shows "Program in progress" everywhere. Each name there
 * carries its own status; only the ones marked Confirmed are carried here, so
 * nobody is announced before they have agreed. A talk without a confirmed name
 * renders a silhouette and "Speaker to be announced".
 *
 * Their export also lists the closing remarks and the afterparty on all three
 * stages. Those are deliberately left out: they were removed from this agenda
 * once before and should not come back with an update.
 */

export type AgendaEventKey = "conference" | "digital-assets-day" | "hackathon";

export const AGENDA_STAGES = [
  "Main Stage",
  "Executive Forum",
  "Future Stage",
] as const;

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

const DAD: Common = { event: "digital-assets-day", day: "2026-10-30" };
const MAIN = "Main Stage";
const FORUM = "Executive Forum";
const FUTURE = "Future Stage";

// Chronological order, then by stage, so the feed reads top to bottom.
export const agendaEntries: AgendaEntry[] = [
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
    speakers: ["Daniel Heinen"],
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
