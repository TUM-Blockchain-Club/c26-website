import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { TAGS } from "@/components/service/conference26";

/**
 * Strapi's webhook target: it tells the site that something was published, and
 * the next request for the affected pages fetches Strapi again instead of
 * waiting out the cache.
 *
 * Without it an edit still appears on its own, within REVALIDATE seconds. This
 * only makes it immediate, which matters while the programme is being
 * finalised and someone is looking at the page to check their change.
 *
 * Set up in Strapi under Settings, Webhooks:
 *
 *   URL      https://conference.tum-blockchain.com/api/revalidate
 *   Header   x-revalidate-secret: <the value of STRAPI_WEBHOOK_SECRET>
 *   Events   Entry publish, unpublish, update, delete
 *
 * The secret has to be set in the Vercel project as well, otherwise every
 * call is refused. Without a shared secret anyone could make the site
 * refetch, which is not dangerous but is not free either.
 */
export const dynamic = "force-dynamic";

/** Compares without leaking the answer through how long it took. A webhook
 * secret is low value, but a string compare that returns on the first wrong
 * byte is the kind of thing that should not be in a codebase at all. */
const sameSecret = (given: string | null, expected: string) => {
  if (!given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
};

/** Which cache tags a Strapi model invalidates. */
const TAG_FOR_MODEL: Record<string, string[]> = {
  "agenda-26": [TAGS.agenda],
  speaker26: [TAGS.speakers, TAGS.agenda], // a speaker shows in the agenda too
  "side-event-26": [TAGS.sideEvents],
  "community-partner-26": [TAGS.partners],
  "sponsor-26": [TAGS.sponsors],
};

export async function POST(request: Request) {
  const secret = process.env.STRAPI_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[revalidate] STRAPI_WEBHOOK_SECRET is not set");
    return Response.json({ error: "not configured" }, { status: 503 });
  }
  if (!sameSecret(request.headers.get("x-revalidate-secret"), secret)) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  let model: string | undefined;
  try {
    const body = await request.json();
    // Strapi sends { event, model, entry }, e.g. model "agenda-26".
    model = typeof body?.model === "string" ? body.model : undefined;
  } catch {
    // A webhook without a usable body still means "something changed".
  }

  // An unknown model refreshes everything rather than silently doing nothing:
  // a new collection type would otherwise never reach the site.
  const tags = (model && TAG_FOR_MODEL[model]) || Object.values(TAGS);
  // Next 16 wants a cache-life profile alongside the tag; `expire: 0` means
  // the tagged entries are stale from now on, so the next request refetches.
  tags.forEach((tag) => revalidateTag(tag, { expire: 0 }));
  console.log(`[revalidate] ${model ?? "unknown model"} -> ${tags.join(", ")}`);

  return Response.json({ revalidated: tags });
}
