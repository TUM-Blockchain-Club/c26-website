import { speakers26 } from "@/constants/Speakers26";

/**
 * The agenda carries speaker names as plain strings, spelled the way
 * Bundesblock's internal export writes them, while the portraits live on the
 * speaker list. This maps one to the other so a session can show faces rather
 * than silhouettes.
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

const PORTRAITS = new Map(
  speakers26.flatMap((s) =>
    s.profile_photo?.url ? [[bareName(s.name), s.profile_photo.url]] : [],
  ),
);

/** The portrait for an agenda name, or undefined if we have none. */
export const portraitFor = (name: string): string | undefined =>
  PORTRAITS.get(bareName(name));
