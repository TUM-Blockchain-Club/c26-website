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
const bareName = (name: string) =>
  name
    .replace(/^(?:(?:Prof\.|Dr\.(?:-Ing\.)?)\s+)+/, "")
    .trim()
    .toLowerCase();

export type SpeakerLink = {
  /** Path to the portrait in `public/`. */
  photo: string;
  /** Anchor of the speaker's card on the speakers page. */
  anchor: string;
};

const BY_NAME = new Map<string, SpeakerLink>(
  speakers26.flatMap((s) =>
    s.profile_photo?.url
      ? [
          [
            bareName(s.name),
            { photo: s.profile_photo.url, anchor: s.documentId },
          ],
        ]
      : [],
  ),
);

/** The portrait and card anchor for an agenda name, or undefined if the
 * speaker page does not carry them. */
export const speakerLinkFor = (name: string): SpeakerLink | undefined =>
  BY_NAME.get(bareName(name));

/** Just the portrait, for callers that do not need the link. */
export const portraitFor = (name: string): string | undefined =>
  BY_NAME.get(bareName(name))?.photo;
