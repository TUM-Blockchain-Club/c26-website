import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AgendaPageBody } from "@/app/agenda/agenda-page";
import {
  dayLabel,
  isShareable,
  peopleOf,
  sessionTime,
  sessionPath,
} from "@/components/agenda/sessionMeta";
import { getAgendaTalks, getTalkById } from "@/components/service/conference26";
import { HACKATHON_AGENDA_URL } from "@/constants/Links";

/**
 * A session's own page: the agenda with that session's dialog open. It is
 * the link people share, so its metadata and preview image (next to this
 * file) describe the session rather than the conference.
 */
type Props = { params: Promise<{ sessionId: string }> };

// A literal, because Next reads segment config statically. Keep it in step
// with the cache lifetime in components/service/conference26.ts.
export const revalidate = 60;

// A session added in Strapi after the last build is rendered on first request
// rather than 404ing until someone deploys.
export const dynamicParams = true;

// Hackathon sessions are not prebuilt: their page sends people on to the
// Hackathon's own agenda, see below.
export const generateStaticParams = async () =>
  (await getAgendaTalks())
    .filter((t) => t.event !== "hackathon")
    .map((t) => ({ sessionId: t.id }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const talk = await getTalkById((await params).sessionId);
  if (!talk) return {};

  const title = `${talk.title ?? "Session"} · TUM Blockchain Conference 26`;
  const names = peopleOf(talk).map((p) => p.name);
  const description = [
    `${[dayLabel(talk.day), sessionTime(talk), talk.stage].filter(Boolean).join(", ")}.`,
    names.length ? `With ${names.join(", ")}.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    title,
    description,
    alternates: { canonical: sessionPath(talk.id) },
    // Replacing the layout's openGraph and twitter blocks drops their image;
    // the opengraph-image and twitter-image files next to this page add the
    // session's own.
    openGraph: {
      title,
      description,
      url: sessionPath(talk.id),
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@tbc_munich",
      creator: "@tbc_munich",
    },
    // An empty slot is reachable but not worth a search result.
    robots: isShareable(talk) ? undefined : { index: false, follow: true },
  };
}

export default async function SessionPage({ params }: Props) {
  const { sessionId } = await params;
  const talk = await getTalkById(sessionId);
  if (!talk) notFound();
  // The Hackathon's schedule lives on its own site, so a shared link to one
  // of its sessions goes there rather than to a feed that leaves it out.
  if (talk.event === "hackathon") redirect(HACKATHON_AGENDA_URL);
  return <AgendaPageBody initialSessionId={sessionId} />;
}
