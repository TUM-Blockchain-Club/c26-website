/**
 * Side events around the TUM Blockchain Conference 26: things other people
 * organise in the same week, which we list because our attendees can walk into
 * them. Hand maintained, like the other snapshots in here, so an event only
 * appears once someone has checked its date, venue and registration link.
 *
 * `note` is for the practical catch an attendee would otherwise discover at
 * the door, such as a separate registration.
 */
export type SideEvent26 = {
  id: string;
  title: string;
  /** One line under the title, in the organiser's own framing. */
  tagline: string;
  description: string;
  host: string;
  /** ISO date, so the card can format it and the list can sort. */
  date: string;
  start: string;
  end: string;
  venue: string;
  language: "German" | "English";
  free: boolean;
  /** Short labels, not sentences; four or five read best on the card. */
  topics: string[];
  link: string;
  note?: string;
};

export const sideEvents26: SideEvent26[] = [
  {
    id: "crypto-tax-crime-2026",
    title: "Crypto Tax & Crime Konferenz 2026",
    tagline: "Krypto im Blickwinkel von Strafverfolgung, Besteuerung und AML",
    description:
      "A full day on the side of crypto that reaches courtrooms and tax offices: seizing and liquidating bitcoin, tracing stolen funds on chain, the anatomy of a hack and how DPRK laundering works, and what DAC8, CARF and the new AML Regulation actually demand. Speakers come from prosecution, forensics, the tax administration and compliance, among them Chainalysis, Tradias, CoinTracking and Bitcoin Suisse.",
    host: "Matthias Steger Consulting and AQ Forensics",
    date: "2026-10-30",
    start: "09:00",
    end: "16:00",
    venue: "House of Communication, Munich",
    language: "German",
    free: true,
    topics: [
      "Law enforcement",
      "Asset seizure",
      "Blockchain forensics",
      "DAC8 & CARF",
      "AML & sanctions",
    ],
    link: "https://ctc-conference.de/#m-anmeldung",
    note: "Same house as the conference, and it runs alongside the Digital Assets Day. Seats are limited and registration is separate: a conference ticket does not cover it.",
  },
];
