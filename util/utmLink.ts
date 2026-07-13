const SITE_URL = "https://conference26.tum-blockchain.com";

/** Link back to the conference site tagged only with utm_source. */
export function buildPartnerUtmLink(): string {
  const url = new URL(SITE_URL);
  url.searchParams.set("utm_source", "community_partner");
  return url.toString();
}
