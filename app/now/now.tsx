"use client";

import { useVersionCheck } from "@/hooks/useVersion";
import React, { useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Text } from "@/components/text";
import {
  Session,
  Stages,
  Speaker,
} from "@/components/service/contentStrapi_static";
import Image from "next/image";
import { contentfulImageLoader } from "@/util/contentfulImageLoader";
import { Link } from "@/components/link";

// Stage display names
const stageDisplayNames: Record<string, string> = {
  "Stage 1": "Turing Stage",
  "Stage 2": "Hopper Stage",
  "Stage 3": "Nakamoto Stage",
  "Workshop Room": "Lovelace Room",
  Gern: "Gern",
  "Lab Lounge": "Lab Lounge",
};

// --- Custom Hook for simulated time (keeps the page updating) ---
const useSimulatedTime = (initialTime: Date) => {
  const [simulatedTime, setSimulatedTime] = useState(initialTime);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setSimulatedTime((prev) => new Date(prev.getTime() + 60000)); // +1 min per second
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);
  return simulatedTime;
};

// ===== Time helpers (robust & simple) =====

// "Now" as an actual instant (UTC under the hood, as JS always does)
const getBerlinNow = (): Date => new Date();

// Format any Date as Munich/Berlin wall clock for DISPLAY/logging
const fmtBerlinDateTime = (d: Date) =>
  d.toLocaleString("de-DE", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const fmtBerlinTime = (d: Date, withTZ = false) =>
  d.toLocaleTimeString("de-DE", {
    timeZone: "Europe/Berlin",
    hour: "2-digit",
    minute: "2-digit",
    ...(withTZ ? { timeZoneName: "short" } : {}),
  });

export type NowProps = {
  sessions: Session[];
  speakers: Speaker[];
  simulatedDate?: Date;
};

const Now: React.FC<NowProps> = ({ sessions, speakers, simulatedDate }) => {
  const initialTime = simulatedDate || new Date();
  // This state change forces re-renders so "now" updates on screen.
  useSimulatedTime(initialTime);

  const newVersionAvailable = useVersionCheck();
  useEffect(() => {
    if (newVersionAvailable) window.location.reload();
  }, [newVersionAvailable]);

  // ⏱️ Auto-refresh exactly every new minute 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());
  useEffect(() => {
    const now = new Date();
    const msUntilNextMinute =
      300_000 -
      ((now.getMinutes() * 60_000 +
        now.getSeconds() * 1000 +
        now.getMilliseconds()) %
        300_000);

    console.log(
      "[AutoReload] scheduling reload in",
      msUntilNextMinute,
      "ms at",
      new Date(Date.now() + msUntilNextMinute).toLocaleTimeString("de-DE", {
        timeZone: "Europe/Berlin",
      }),
    );

    const timeout = setTimeout(() => {
      console.log("[AutoReload] Reloading now!");
      window.location.reload();
    }, msUntilNextMinute);

    return () => clearTimeout(timeout);
  }, []);

  // Speaker lookup
  const speakerMap = new Map(
    speakers.map((sp) => [sp.name.toLowerCase().trim(), sp]),
  );

  const resolveSpeakers = (session: Session): Speaker[] => {
    if (!session.speakers) return [];
    return Object.values(session.speakers)
      .map((name) => speakerMap.get(name.toLowerCase().trim()))
      .filter((sp): sp is Speaker => !!sp);
  };

  // --- Utility to compare days in Europe/Berlin (for filtering "today") ---
  const toBerlinDateString = (d: Date) =>
    d.toLocaleDateString("en-CA", { timeZone: "Europe/Berlin" });
  const todayBerlin = toBerlinDateString(new Date());

  const getCurrentAndNextSessions = (
    sessionsInStage: Session[],
  ): { currentSession: Session | null; nextSession: Session | null } => {
    const now = getBerlinNow(); // real "now"
    let currentSession: Session | null = null;
    let nextSession: Session | null = null;

    sessionsInStage.sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );

    for (const session of sessionsInStage) {
      const startTime = new Date(session.startTime);
      const endTime = new Date(session.endTime);

      console.log(
        "NOW (Munich)",
        fmtBerlinDateTime(now),
        "START",
        fmtBerlinDateTime(startTime),
        "END",
        fmtBerlinDateTime(endTime),
      );

      if (now >= startTime && now < endTime) {
        currentSession = session;
      } else if (now < startTime && !nextSession) {
        nextSession = session;
      }
    }

    return { currentSession, nextSession };
  };

  return (
    <div className="flex justify-center min-h-screen">
      <main className="w-full lg:max-w-7xl 2xl:max-w-full pt-[25px] lg:pt-0 z-20 pb-40 min-h-full">
        <Container className="flex flex-col min-h-full">
          {/* Header */}
          <div className="mt-[100px] md:mt-[20vh] z-10 max-w-3xl">
            <div className="flex flex-col items-start gap-8">
              <Text textType="sub_hero" className="text-gradient text-left">
                Now
              </Text>
              <Text textType="small">
                Grab it on your phone:{" "}
                <Link
                  className="font-bold"
                  href="https://conference26.tum-blockchain.com/now"
                >
                  https://conference26.tum-blockchain.com/now
                </Link>
              </Text>
            </div>
          </div>

          {/* Sessions Grid */}
          <div className="flex flex-col pt-24 flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 flex-wrap gap-8">
              {Stages.map((stage, key) => {
                const sessionsInThisStage = sessions.filter((session) => {
                  const sessionDay = toBerlinDateString(
                    new Date(session.startTime),
                  );
                  return session.room === stage && sessionDay === todayBerlin;
                });

                const { currentSession, nextSession } =
                  getCurrentAndNextSessions(sessionsInThisStage);

                return (
                  <div
                    className="flex md:min-h-[500px] flex-1 border p-4 flex-col gap-16"
                    key={key}
                  >
                    {/* Current Session */}
                    <div>
                      <h3 className="text-lg text-gradient font-bold">
                        {stageDisplayNames[stage] || stage}
                      </h3>
                      {currentSession ? (
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-2">
                            <Text textType="sub_title">
                              {currentSession.title}
                            </Text>
                            <Text>
                              {fmtBerlinTime(
                                new Date(currentSession.startTime),
                              )}{" "}
                              -{" "}
                              {fmtBerlinTime(
                                new Date(currentSession.endTime),
                                true,
                              )}
                            </Text>
                          </div>
                          <div className="flex flex-col gap-4">
                            {resolveSpeakers(currentSession).map(
                              (speaker, index) => (
                                <div
                                  className="flex gap-2 items-start"
                                  key={index}
                                >
                                  {speaker.profile_photo?.url && (
                                    <Image
                                      src={speaker.profile_photo.url}
                                      loader={contentfulImageLoader}
                                      alt={speaker.name}
                                      width={48}
                                      height={48}
                                      className="rounded-full object-cover"
                                    />
                                  )}
                                  <div className="flex flex-col max-w-48">
                                    <Text className="break-words hyphens-auto">
                                      {speaker.name}
                                    </Text>
                                    {speaker.position && (
                                      <Text textType="small">
                                        {speaker.position}
                                        {speaker.company_name
                                          ? `, ${speaker.company_name}`
                                          : ""}
                                      </Text>
                                    )}
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      ) : (
                        <Text>There is currently no active session.</Text>
                      )}
                    </div>

                    {/* Next Session */}
                    <div className="opacity-40">
                      <h4 className="font-bold">Up Next</h4>
                      {nextSession ? (
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-1">
                            <Text
                              textType="paragraph"
                              className="text-ellipsis"
                            >
                              {nextSession.title}
                            </Text>
                            <Text>
                              {fmtBerlinTime(new Date(nextSession.startTime))} -{" "}
                              {fmtBerlinTime(
                                new Date(nextSession.endTime),
                                true,
                              )}
                            </Text>
                          </div>
                          {resolveSpeakers(nextSession).map(
                            (speaker, index) => (
                              <div
                                className="flex gap-2 items-start"
                                key={index}
                              >
                                {speaker.profile_photo?.url && (
                                  <Image
                                    src={speaker.profile_photo.url}
                                    loader={contentfulImageLoader}
                                    alt={speaker.name}
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover"
                                  />
                                )}
                                <div className="flex flex-col max-w-48">
                                  <Text className="break-words hyphens-auto">
                                    {speaker.name}
                                  </Text>
                                  {speaker.position && (
                                    <Text textType="small">
                                      {speaker.position}
                                      {speaker.company_name
                                        ? `, ${speaker.company_name}`
                                        : ""}
                                    </Text>
                                  )}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      ) : (
                        <Text>There is no next event in this room.</Text>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
};

export default Now;
