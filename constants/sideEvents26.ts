/**
 * Side events around the TUM Blockchain Conference 26: things other people
 * organise in the same week, which we list because our attendees can walk into
 * them. Hand maintained, like the other snapshots in here, so an event only
 * appears once someone has checked its date, venue and registration link.
 *
 * Keep the entries short: the card is a pointer, not a programme. One line of
 * description, a handful of topic words, and `note` only for the practical
 * catch an attendee would otherwise discover at the door.
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
  /** Square key visual, if the organiser has one. Without it the card draws
   * its own tile rather than borrowing a picture that is not theirs. */
  image?: string;
};

export const sideEvents26: SideEvent26[] = [
  {
    id: "crypto-tax-crime-2026",
    title: "Crypto Tax & Crime Konferenz 2026",
    tagline: "Krypto im Blickwinkel von Strafverfolgung, Besteuerung und AML",
    description:
      "Crypto seen from prosecution, taxation and AML: seizure, forensics, DAC8 and CARF.",
    host: "Matthias Steger Consulting and AQ Forensics",
    date: "2026-10-30",
    start: "09:00",
    end: "16:00",
    venue: "House of Communication, Munich",
    language: "German",
    free: true,
    topics: ["Law enforcement", "Forensics", "DAC8 & CARF", "AML"],
    link: "https://ctc-conference.de/#m-anmeldung",
    note: "Separate registration, limited seats. A conference ticket does not cover it.",
  },
];
