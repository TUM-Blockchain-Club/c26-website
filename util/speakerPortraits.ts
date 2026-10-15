import { speakers26 } from "@/constants/Speakers26";

/**
 * The agenda carries speaker names as plain strings, spelled the way
 * Bundesblock's internal export writes them, while the portraits and the
 * speaker page live off the speaker list. This maps one to the other so a
 * session can show faces rather than silhouettes, and so a face can link to
 * the person's card.
 *
 * Matching ignores academic titles, because the two sources disagree about
 * them: the export writes "Prof. Philipp Maume" where a speaker submitted the
 * plain name, and elsewhere the other way round. Everything else has to match
 * exactly, so a near-miss stays a silhouette instead of showing a stranger.
 */
export const bareName = (name: string) =>
  name
    // Bundesblock's exports have shipped a narrow no-break space between first
    // and last name, which matches nothing; fold every kind of whitespace, and
    // compose accents the one way, before comparing.
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .replace(/^(?:(?:Prof\.|Dr\.(?:-Ing\.)?)\s+)+/, "")
    // The two sources also disagree about accents: the agenda writes "André
    // Liesenfeld" where he submitted "Andre", and "Pavel Hubacek" where he
    // submitted "Hubáček". Comparing without them costs nothing here, since
    // no two speakers differ by an accent alone.
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase();

export type SpeakerLink = {
  /** The name as the speaker list spells it, which may carry a title the
   * agenda leaves off, or the other way round. */
  name: string;
  /** Path to the portrait in `public/`. */
  photo: string;
  /** Anchor of the speaker's card on the speakers page. */
  anchor: string;
  position?: string;
  company?: string;
};

/**
 * The same projection for a speaker list that came from Strapi rather than
 * from the file below, so the live agenda and the compiled fallback describe a
 * speaker identically. Anyone without a photo is left out: the agenda shows a
 * silhouette for them either way, and a link to an empty card would be worse.
 */
export const speakerLinksFrom = (
  speakers: {
    name: string;
    documentId: string;
    position?: string;
    company_name?: string;
    profile_photo?: { url: string } | null;
  }[],
): SpeakerLink[] =>
  speakers.flatMap((s) =>
    s.profile_photo?.url
      ? [
          {
            name: s.name,
            photo: s.profile_photo.url,
            anchor: s.documentId,
            position: s.position,
            company: s.company_name,
          },
        ]
      : [],
  );

const BY_NAME = new Map<string, SpeakerLink>(
  speakers26.flatMap((s) =>
    s.profile_photo?.url
      ? [
          [
            bareName(s.name),
            {
              name: s.name,
              photo: s.profile_photo.url,
              anchor: s.documentId,
              position: s.position,
              company: s.company_name,
            },
          ],
        ]
      : [],
  ),
);

/** Everything the agenda can show about a speaker, or undefined if the speaker
 * page does not carry them. */
export const speakerLinkFor = (name: string): SpeakerLink | undefined =>
  BY_NAME.get(bareName(name));

/** "Head of Treasury, WIBank", or just the one half we have. */
export const roleLine = (s?: SpeakerLink): string | undefined =>
  s
    ? [s.position, s.company].filter(Boolean).join(", ") || undefined
    : undefined;

/** Just the portrait, for callers that do not need the link. */
export const portraitFor = (name: string): string | undefined =>
  BY_NAME.get(bareName(name))?.photo;
