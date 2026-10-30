import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  STAGE_BASE,
  STAGE_COOKIE,
  passOk,
} from "@/components/stage/stageAccess";
import Link from "next/link";
import { Container } from "@/components/container";
import { Text } from "@/components/text";
import { STAGE_ROOMS, getStageSlots } from "@/components/stage/stageData";

export const revalidate = 60;

const DAY_NAMES: Record<string, string> = {
  "2026-10-29": "Thu 29 Oct",
  "2026-10-30": "Fri 30 Oct",
  "2026-10-31": "Sat 31 Oct",
};
const dayOf = (ms: number) =>
  new Date(ms + 60 * 60 * 1000).toISOString().slice(0, 10);

// Unlisted: the stage screens are for the tech crew, reachable only with the
// link and kept out of search engines.
export const metadata: Metadata = {
  title: "Stage Screens, TUM Blockchain Conference 26",
  robots: { index: false, follow: false },
};

const KEYS: [string, string][] = [
  [
    "→ / Space / Enter / clicker",
    "next cue: Up next → Intro → On stage → Slides → next session",
  ],
  ["←", "back one cue"],
  ["↓ / ↑", "jump to the next / previous session"],
  ["P", "short-pause screen on / off"],
  ["B", "black screen on / off"],
  ["I", "replay the intro"],
  ["M", "sound on / off"],
  ["A", "jump to the cue that fits the current time"],
  ["F", "full screen"],
];

export default async function StageIndexPage() {
  if (!(await passOk((await cookies()).get(STAGE_COOKIE)?.value)))
    redirect(`${STAGE_BASE}/login`);
  const rooms = await Promise.all(
    STAGE_ROOMS.map(async (r) => {
      const slots = await getStageSlots(r);
      const days = new Map<string, boolean>();
      for (const sl of slots) {
        const d = dayOf(sl.start);
        days.set(d, days.get(d) || sl.event === "digital-assets-day");
      }
      return { ...r, days: [...days] };
    }),
  );
  return (
    <div className="flex justify-center">
      <main className="w-full max-w-5xl pt-page-pt lg:pt-0 z-20 pb-40">
        <Container>
          <div className="mt-page-top md:mt-page-top-lg z-10 flex flex-col gap-10">
            <div className="flex flex-col gap-3">
              <Text as="p" textType="small" className="eyebrow-tbc">
                Tech crew
              </Text>
              <Text textType="hero" className="text-gradient">
                Stage Screens
              </Text>
              <Text
                as="p"
                textType="paragraph"
                className="text-secondary max-w-2xl"
              >
                Pick the stage and the day to start its screen. The Digital
                Assets Day runs in blue throughout. Nothing moves on its own:
                every step is one press of → or the clicker. While a speaker
                presents, switch the projector to their laptop and come back
                here afterwards. Changes in Strapi appear within a minute.
              </Text>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {rooms.map((r) => (
                <div
                  key={r.slug}
                  className="flex flex-col gap-4 rounded-xl border border-line p-6"
                >
                  <div className="flex flex-col gap-1">
                    <Text as="p" textType="sub_title" className="font-bold">
                      {r.room}
                    </Text>
                    <Text as="p" textType="small" className="text-muted">
                      {r.labels["digital-assets-day"]} on the Digital Assets Day
                    </Text>
                  </div>
                  <div className="flex flex-col gap-2">
                    {r.days.map(([day, dad]) => (
                      <Link
                        key={day}
                        href={`/stage-76803f8f95/${r.slug}?day=${day}`}
                        className={`flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-bold transition-colors ${
                          dad
                            ? "border-blue-400/60 text-blue-200 hover:bg-blue-400/10"
                            : "border-line hover:border-white"
                        }`}
                      >
                        <span>{DAY_NAMES[day] ?? day}</span>
                        <span className="font-normal opacity-80">
                          {dad ? "Digital Assets Day" : "Conference"}
                        </span>
                      </Link>
                    ))}
                    {/* Turing's LED wall is 3840 x 1152; this runs the same
                        screen as a plain 16:9 picture for a normal projector. */}
                    {r.slug === "turing" &&
                      r.days.map(([day]) => (
                        <Link
                          key={`${day}-169`}
                          href={`/stage-76803f8f95/${r.slug}?day=${day}&format=landscape`}
                          className="flex items-center justify-between rounded-lg border border-dashed border-line px-4 py-2 text-xs font-bold transition-colors hover:border-white"
                        >
                          <span>{DAY_NAMES[day] ?? day}</span>
                          <span className="font-normal opacity-80">
                            16:9 landscape
                          </span>
                        </Link>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <Text as="p" textType="sub_title" className="font-bold">
                Hackathon stage
              </Text>
              <Text
                as="p"
                textType="small"
                className="text-secondary max-w-2xl"
              >
                The Hackathon opening runs as its own presentation. Open it on
                the stage computer and press F for full screen.
              </Text>
              <div className="flex flex-wrap gap-3">
                <a
                  href="/stage-76803f8f95/hackathon"
                  className="rounded-lg border border-line px-4 py-2 text-sm font-bold hover:border-white"
                >
                  Hackathon opening
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Text as="p" textType="sub_title" className="font-bold">
                Speaker slides
              </Text>
              <Text
                as="p"
                textType="small"
                className="text-secondary max-w-2xl"
              >
                Upload each speaker&apos;s PDF in the studio of their room, on
                the stage computer itself. Its pages follow &ldquo;On
                stage&rdquo;, one per click. A talk without slides keeps the
                photo slide.
              </Text>
              <div className="flex flex-wrap gap-3">
                {STAGE_ROOMS.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/stage-76803f8f95/${r.slug}/studio`}
                    className="rounded-lg border border-line px-4 py-2 text-sm font-bold hover:border-white"
                  >
                    {r.room} studio
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Text as="p" textType="sub_title" className="font-bold">
                Controls
              </Text>
              <Text
                as="p"
                textType="small"
                className="text-secondary max-w-2xl"
              >
                A presentation clicker works too. Moving the mouse shows the
                same controls as buttons. A reload resumes at the same cue.
              </Text>
              <dl className="grid gap-x-8 gap-y-2 sm:grid-cols-[auto_1fr]">
                {KEYS.map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="font-mono text-sm text-white">{k}</dt>
                    <dd className="text-sm text-secondary">{v}</dd>
                  </div>
                ))}
              </dl>
              <Text as="p" textType="small" className="text-muted max-w-2xl">
                Rehearsal: add <code>?at=2026-10-29T09:20</code> to a stage link
                to set the clock and countdowns to that time, and{" "}
                <code>&amp;speed=20</code> to fast-forward them.
              </Text>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
