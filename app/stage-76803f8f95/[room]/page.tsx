import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import {
  STAGE_BASE,
  STAGE_COOKIE,
  passOk,
} from "@/components/stage/stageAccess";
import { Suspense } from "react";
import { StageDisplay } from "@/components/stage/StageDisplay";
import { STAGE_ROOMS, getStageSlots } from "@/components/stage/stageData";

// Same lifetime as the agenda, so an edit in Strapi reaches the screen within
// a minute; the display also asks for a refresh every minute.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Stage Screen, TUM Blockchain Conference 26",
  robots: { index: false, follow: false },
};

export const generateStaticParams = () =>
  STAGE_ROOMS.map((r) => ({ room: r.slug }));

type Props = { params: Promise<{ room: string }> };

export default async function StageScreenPage({ params }: Props) {
  if (!(await passOk((await cookies()).get(STAGE_COOKIE)?.value)))
    redirect(`${STAGE_BASE}/login`);
  const { room: slug } = await params;
  const room = STAGE_ROOMS.find((r) => r.slug === slug);
  if (!room) notFound();
  const slots = await getStageSlots(room);
  // The rehearsal clock reads the query string, which needs a boundary.
  return (
    <Suspense>
      <StageDisplay
        roomSlug={room.slug}
        room={room.room}
        rooms={STAGE_ROOMS.map((r) => ({
          slug: r.slug,
          room: r.room,
          dad: r.labels["digital-assets-day"],
        }))}
        slots={slots}
      />
    </Suspense>
  );
}
