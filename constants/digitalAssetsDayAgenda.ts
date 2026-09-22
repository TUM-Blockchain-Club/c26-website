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
 * Speakers and moderators are not assigned yet, so no entry carries a speaker;
 * a talk without one renders a silhouette and "Speaker to be announced".
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
      speaker?: string; // missing = to be announced
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
    time: "8:00",
    duration: 45,
    stage: MAIN,
    label: "Arrival & Networking",
  },
  {
    ...DAD,
    kind: "talk",
    time: "8:45",
    duration: 15,
    stage: MAIN,
    track: "General Interest",
    title: "Welcome & Opening",
  },
  {
    ...DAD,
    kind: "talk",
    time: "8:50",
    duration: 55,
    stage: FORUM,
    track: "General Interest",
    title: "Opening Session (Main Stage)",
  },
  {
    ...DAD,
    kind: "talk",
    time: "8:50",
    duration: 55,
    stage: FUTURE,
    track: "General Interest",
    title: "Opening Session (Main Stage)",
  },
  {
    ...DAD,
    kind: "talk",
    time: "9:00",
    duration: 10,
    stage: MAIN,
    track: "General Interest",
    title: "Opening Speech",
  },
  {
    ...DAD,
    kind: "talk",
    time: "9:10",
    duration: 15,
    stage: MAIN,
    track: "General Interest",
    title: "The State of Digital Assets 2026",
  },
  {
    ...DAD,
    kind: "talk",
    time: "9:25",
    duration: 20,
    stage: MAIN,
    track: "Policy & Regulation",
    title:
      "A European Digital Assets Strategy? The French-German Task Force on the Future of Financial Markets",
  },
  {
    ...DAD,
    kind: "talk",
    time: "9:45",
    duration: 15,
    stage: MAIN,
    track: "Stablecoins & Payments",
    title: "From Digital Euro to Stablecoin Rails - The New Money Stack",
  },
  {
    ...DAD,
    kind: "talk",
    time: "9:45",
    duration: 30,
    stage: FORUM,
    track: "Digital Capital Markets",
    title: "European Banking Consortia driving Digital Capital Markets",
  },
  {
    ...DAD,
    kind: "talk",
    time: "10:00",
    duration: 35,
    stage: MAIN,
    track: "Stablecoins & Payments",
    title: "The New Money Stack - what's Europe's positioning",
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
  },
  {
    ...DAD,
    kind: "talk",
    time: "11:00",
    duration: 55,
    stage: FORUM,
    track: "Stablecoins & Payments",
    title:
      "Corporate Treasuries & Agentic AI Payments - must-have Capabilities for the German Economy",
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
    time: "11:30",
    duration: 10,
    stage: FUTURE,
    track: "Tokenization & RWA",
    title: "Programmable Supply Chains",
  },
  {
    ...DAD,
    kind: "talk",
    time: "11:40",
    duration: 10,
    stage: FUTURE,
    track: "Tokenization & RWA",
    title: "Pilot Training @Airport Salzburg",
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
  },
  {
    ...DAD,
    kind: "talk",
    time: "11:50",
    duration: 45,
    stage: FUTURE,
    track: "Tokenization & RWA",
    title: "The programmable Company",
  },
  {
    ...DAD,
    kind: "talk",
    time: "11:55",
    duration: 55,
    stage: FORUM,
    track: "Digital Capital Markets",
    title: "Portfolio Construction & Institutional Allocation",
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
    time: "12:50",
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
    time: "13:35",
    duration: 40,
    stage: MAIN,
    track: "Tokenization & RWA",
    title: "What should be Tokenized First?",
  },
  {
    ...DAD,
    kind: "talk",
    time: "13:35",
    duration: 45,
    stage: FORUM,
    track: "Stablecoins & Payments",
    title: "AI x Blockchain Beyond Payments - Decision-Maker Briefing",
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
    time: "13:55",
    duration: 45,
    stage: FUTURE,
    track: "Institutional Trust Infrastructure",
    title:
      "All ways lead to Rome: Pontes, Appia & the necessary marriage of financial & technical sovereignty",
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
  },
  {
    ...DAD,
    kind: "talk",
    time: "14:20",
    duration: 60,
    stage: FORUM,
    track: "Tokenization & RWA",
    title: "Tokenization Deep Dive - Assets, Adoption & Distribution",
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
    time: "14:40",
    duration: 45,
    stage: FUTURE,
    track: "Digital Capital Markets",
    title: "Leaders vs. Laggards: Financial Institutions of the Future",
  },
  {
    ...DAD,
    kind: "talk",
    time: "14:55",
    duration: 35,
    stage: MAIN,
    track: "Institutional Trust Infrastructure",
    title: "Scaling Institutional Trust: Custody, Wallets, Identity & Security",
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
  },
  {
    ...DAD,
    kind: "talk",
    time: "15:50",
    duration: 25,
    stage: MAIN,
    track: "General Interest",
    title: "How to Collaborate: Industry x Blockchain Foundations",
  },
  {
    ...DAD,
    kind: "talk",
    time: "15:50",
    duration: 10,
    stage: FUTURE,
    track: "General Interest",
    title: "To be announced",
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
  },
  {
    ...DAD,
    kind: "talk",
    time: "16:10",
    duration: 55,
    stage: FORUM,
    track: "Institutional Trust Infrastructure",
    title:
      "Trust Infrastructure for Institutions - Custody, Wallets, Identity & Compliance",
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
  },
  {
    ...DAD,
    kind: "talk",
    time: "16:55",
    duration: 35,
    stage: MAIN,
    track: "General Interest",
    title: "Society 2035 - AI, Digital Assets & our Future Economic Backend",
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
  {
    ...DAD,
    kind: "milestone",
    label: "Closing Remarks & Transition to Afterparty",
    time: "17:55",
    stage: MAIN,
  },
  {
    ...DAD,
    kind: "milestone",
    label: "Official Afterparty",
    time: "18:20",
    stage: MAIN,
  },
  {
    ...DAD,
    kind: "milestone",
    label: "Official Afterparty",
    time: "18:20",
    stage: FORUM,
  },
  {
    ...DAD,
    kind: "milestone",
    label: "Official Afterparty",
    time: "18:20",
    stage: FUTURE,
  },
];
