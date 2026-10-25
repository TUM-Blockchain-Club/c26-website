import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import {
  STAGE_BASE,
  STAGE_COOKIE,
  passOk,
} from "@/components/stage/stageAccess";
import { StageStudio } from "@/components/stage/StageStudio";
import { STAGE_ROOMS, getStageSlots } from "@/components/stage/stageData";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Stage Studio, TUM Blockchain Conference 26",
  robots: { index: false, follow: false },
};

export const generateStaticParams = () =>
  STAGE_ROOMS.map((r) => ({ room: r.slug }));

type Props = { params: Promise<{ room: string }> };

export default async function StageStudioPage({ params }: Props) {
  if (!(await passOk((await cookies()).get(STAGE_COOKIE)?.value)))
    redirect(`${STAGE_BASE}/login`);
  const { room: slug } = await params;
  const room = STAGE_ROOMS.find((r) => r.slug === slug);
  if (!room) notFound();
  const slots = await getStageSlots(room);
  return <StageStudio roomSlug={room.slug} room={room.room} slots={slots} />;
}
