import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AgendaPageBody } from "@/app/agenda/agenda-page";
import {
  dayLabel,
  isShareable,
  peopleOf,
  timeRange,
  sessionPath,
} from "@/components/agenda/sessionMeta";
import { agendaTalks, talkById } from "@/constants/digitalAssetsDayAgenda";

/**
 * A session's own page: the agenda with that session's dialog open. It is
 * the link people share, so its metadata and preview image (next to this
 * file) describe the session rather than the conference.
 */
type Props = { params: Promise<{ sessionId: string }> };

export const dynamicParams = false;

export const generateStaticParams = () =>
  agendaTalks.map((t) => ({ sessionId: t.id }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const talk = talkById((await params).sessionId);
  if (!talk) return {};

  const title = `${talk.title ?? "Session"} · TUM Blockchain Conference 26`;
  const names = peopleOf(talk).map((p) => p.name);
  const description = [
    `${dayLabel(talk.day)}, ${timeRange(talk.time, talk.duration)}, ${talk.stage}.`,
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
  if (!talkById(sessionId)) notFound();
  return <AgendaPageBody initialSessionId={sessionId} />;
}
