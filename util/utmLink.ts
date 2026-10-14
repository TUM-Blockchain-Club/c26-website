const SITE_URL = "https://conference26.tum-blockchain.com";

/** Link back to the conference site tagged only with utm_source. */
export function buildPartnerUtmLink(): string {
  const url = new URL(SITE_URL);
  url.searchParams.set("utm_source", "community_partner");
  return url.toString();
}

/** Same link for media partners, so their coverage is attributable. */
export function buildMediaUtmLink(): string {
  const url = new URL(SITE_URL);
  url.searchParams.set("utm_source", "media_partner");
  return url.toString();
}

/** Link for speakers sharing that they are on the programme. */
export function buildSpeakerUtmLink(): string {
  const url = new URL(SITE_URL);
  url.searchParams.set("utm_source", "speaker");
  return url.toString();
}

/** Link for attendees sharing that they are going. */
export function buildAttendeeUtmLink(): string {
  const url = new URL(SITE_URL);
  url.searchParams.set("utm_source", "attendee");
  return url.toString();
}

/** A session's own page, for people sharing it from the agenda. The medium
 * says how it was shared (native share sheet or copied link) and the content
 * which session, so Plausible and the Luma checkout can attribute it. */
export function buildSessionShareLink(
  sessionId: string,
  medium: string,
): string {
  const url = new URL(`/agenda/${sessionId}`, SITE_URL);
  url.searchParams.set("utm_source", "session_share");
  url.searchParams.set("utm_medium", medium);
  url.searchParams.set("utm_content", sessionId);
  return url.toString();
}
