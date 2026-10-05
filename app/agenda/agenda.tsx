"use client";

import { Session as SessionComponent } from "@/components/session";
import { Text } from "@/components/text";
import { Toggle } from "@/components/toggle";
// import { Session, Stages, Tracks } from "@/model/session";
import * as Separator from "@radix-ui/react-separator";
import classNames from "classnames";
import React, { useState } from "react";
import { Session, Speaker } from "@/components/service/contentStrapi_static";
import AgendaFeed from "@/components/agenda/AgendaFeed";
import {
  agendaEntries,
  ROOMS,
  roomOfStage,
  DAD_TRACKS,
  CONFERENCE_TRACKS,
  type AgendaTrackName,
} from "@/constants/digitalAssetsDayAgenda";
type AgendaProps = { sessions: Session[]; speakers: Speaker[] };

// The three main parts of the conference. Sessions are matched via their
// `event` field once the programme is published; each part keeps its own
// accent so they are distinguishable at a glance (Digital Assets Day is
// bluish like its logo, the Hackathon red like its logo).
const EVENTS = [
  {
    key: "conference",
    label: "TUM Blockchain Conference Day",
    dot: "bg-gradient-tbc",
    active: "border-tbc-yellow bg-tbc-yellow/15 text-white",
  },
  {
    key: "digital-assets-day",
    label: "Digital Assets Day",
    dot: "bg-blue-400",
    active: "border-blue-400 bg-blue-400/15 text-white",
  },
  {
    key: "hackathon",
    label: "Hackathon",
    dot: "bg-red-500",
    active: "border-red-500 bg-red-500/15 text-white",
  },
] as const;

type EventKey = (typeof EVENTS)[number]["key"];

/** Track families, one per event that sorts its sessions into tracks. Only
 * the Digital Assets Day does; the group stays named so it is obvious the
 * tracks belong to that day and not to the whole programme. */
const TRACK_GROUPS = [
  {
    label: "Digital Assets Day",
    tracks: DAD_TRACKS as readonly {
      name: string;
      dot: string;
      active: string;
    }[],
  },
].filter((g) => g.tracks.length > 0);

export const Agenda: React.FC<AgendaProps> = ({ sessions, speakers }) => {
  const [titleFilter, setTitleFilter] = useState<string>("");
  const [eventFilter, setEventFilter] = useState<EventKey>();
  const [roomFilter, setRoomFilter] = useState<string>();
  const [trackFilter, setTrackFilter] = useState<AgendaTrackName>();

  const STAGE_PRIORITY: Record<string, number> = {
    "Stage 3": 0, // Nakamoto — highest priority
    "Stage 1": 1, // Turing
    "Stage 2": 2, // Hopper
    Gern: 2, // Gern
    "Workshop Room": 3, // Lovelace
    "Lab lounge": 0, // Lab lounge
  };
  const SAME_TIME_WINDOW_MS = 0 * 60 * 1000; // 5 minutes

  // The published programme entries (one entity per talk) follow every
  // filter. Breaks, milestones and open slots only accompany the full flow.
  const feedQuery = titleFilter.trim().toLowerCase();
  const visibleEntries = agendaEntries.filter((entry) => {
    if (eventFilter && entry.event !== eventFilter) return false;

    if (entry.kind !== "talk") {
      if (feedQuery || trackFilter) return false;
      if (
        roomFilter &&
        "stage" in entry &&
        entry.stage &&
        roomOfStage(entry.stage) !== roomFilter
      )
        return false;
      return true;
    }

    if (roomFilter && roomOfStage(entry.stage) !== roomFilter) return false;
    if (trackFilter && entry.track !== trackFilter) return false;
    if (feedQuery) {
      const haystack = [
        entry.title,
        entry.format,
        entry.track,
        entry.stage,
        entry.speakers?.join(" "),
        entry.moderator,
      ]
        .filter(Boolean)
        .join(" | ")
        .toLowerCase();
      if (!haystack.includes(feedQuery)) return false;
    }
    return true;
  });
  const visibleTalksCount = visibleEntries.filter(
    (entry) => entry.kind === "talk",
  ).length;
  const feedHasOwnFilters = !!(feedQuery || roomFilter || trackFilter);
  const anyFilter = !!(feedHasOwnFilters || eventFilter);
  const clearFilters = () => {
    setTitleFilter("");
    setEventFilter(undefined);
    setRoomFilter(undefined);
    setTrackFilter(undefined);
  };

  let filteredSessions = null;

  if (sessions) {
    filteredSessions = sessions.filter((item) => {
      const matchesEvent = !eventFilter || (item as any).event === eventFilter;

      const q = titleFilter.trim().toLowerCase();

      const speakerTextParts: string[] = [];
      const rawSpeakers = (item as any).speakers;
      if (rawSpeakers && typeof rawSpeakers === "object") {
        speakerTextParts.push(
          ...Object.keys(rawSpeakers).map((x) => String(x)),
          ...Object.values(rawSpeakers).map((x) => String(x)),
        );
      }

      const searchableChunks = [
        item.title,
        (item as any).subtitle,
        (item as any).description,
        (item as any).abstract,
        (item as any).summary,
        item.track,
        item.room,
        ...(Array.isArray((item as any).tags) ? (item as any).tags : []),
        ...(Array.isArray((item as any).keywords)
          ? (item as any).keywords
          : []),
        ...speakerTextParts,
      ]
        .filter(Boolean)
        .map((x) => String(x).toLowerCase());

      const haystack = searchableChunks.join(" | ");

      const matchesTitle = !q || haystack.includes(q);

      return matchesEvent && matchesTitle;
    });

    filteredSessions.sort((a, b) => {
      const ta = new Date(a.startTime).getTime();
      const tb = new Date(b.startTime).getTime();

      if (ta !== tb) {
        // If they're close in time, apply stage priority
        if (Math.abs(ta - tb) <= SAME_TIME_WINDOW_MS) {
          const pa = STAGE_PRIORITY[a.room] ?? 99;
          const pb = STAGE_PRIORITY[b.room] ?? 99;
          if (pa !== pb) return pa - pb;
        }
        return ta - tb;
      }

      const pa = STAGE_PRIORITY[a.room] ?? 99;
      const pb = STAGE_PRIORITY[b.room] ?? 99;
      if (pa !== pb) return pa - pb;

      if (a.room !== b.room) return a.room.localeCompare(b.room);
      return a.title.localeCompare(b.title);
    });
  }

  return (
    <div className={"flex flex-col md:flex-row relative gap-8 mt-20"}>
      <div
        id="filter"
        className="bg-black md:sticky md:top-24 border border-white rounded-sm p-6 md:min-w-[250px] flex flex-col gap-4 md:gap-6 h-fit"
      >
        <Text textType={"sub_title"} className="text-left" as="p">
          Filter
        </Text>
        <div className="flex flex-col gap-2">
          <Text textType={"paragraph"} className="font-bold text-left" as="p">
            Search
          </Text>
          <input
            type="text"
            value={titleFilter}
            onChange={(e) => setTitleFilter(e.target.value)}
            placeholder="Titles, speakers, descriptions…"
            className="w-full rounded-lg text-white border py-2 px-3 bg-black placeholder-gray-500"
          />
        </div>
        <div className="flex flex-col gap-3 h-fit">
          <Text textType={"paragraph"} className="font-bold text-left" as="p">
            Event
          </Text>
          <div className="flex flex-row md:flex-col flex-wrap gap-2">
            {EVENTS.map((event) => {
              const selected = eventFilter === event.key;
              return (
                <button
                  key={event.key}
                  type="button"
                  onClick={() =>
                    setEventFilter(selected ? undefined : event.key)
                  }
                  className={classNames(
                    "flex items-center gap-2.5 rounded-lg border py-2 px-3 text-left transition-colors w-fit md:w-full",
                    selected
                      ? event.active
                      : "border-line text-secondary hover:border-line-strong hover:text-white",
                  )}
                >
                  <span
                    className={classNames(
                      "inline-block h-3 w-3 shrink-0 rounded-full",
                      event.dot,
                    )}
                    aria-hidden
                  />
                  <Text
                    textType={"small"}
                    className="!text-inherit text-left"
                    as="p"
                  >
                    {event.label}
                  </Text>
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-3 h-fit">
          <div className="flex flex-col gap-1">
            <Text textType={"paragraph"} className="font-bold text-left" as="p">
              Stages
            </Text>
            <Text textType={"small"} className="text-muted text-left" as="p">
              Three rooms, used by both days under their own names.
            </Text>
          </div>
          <div className="flex flex-row md:flex-col flex-wrap gap-2">
            {ROOMS.map((room) => (
              <Toggle
                key={room.room}
                onClick={() =>
                  setRoomFilter(
                    roomFilter === room.room ? undefined : room.room,
                  )
                }
                pressed={roomFilter === room.room}
                className="rounded-sm w-fit md:w-full rounded-lg text-white border py-2 px-3"
              >
                <span className="flex flex-col gap-0.5 text-left">
                  <Text
                    textType={"small"}
                    className="!text-inherit text-left font-bold"
                    as="p"
                  >
                    {room.room}
                  </Text>
                  <Text
                    textType={"small"}
                    className="text-muted text-left"
                    as="p"
                  >
                    {room.labels["digital-assets-day"]} on Oct 30
                  </Text>
                </span>
              </Toggle>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 h-fit">
          <div className="flex flex-col gap-1">
            <Text textType={"paragraph"} className="font-bold text-left" as="p">
              Tracks
            </Text>
            <Text textType={"small"} className="text-muted text-left" as="p">
              Only sessions the programme sorts into a track carry one.
            </Text>
          </div>
          {TRACK_GROUPS.map((group) => (
            <div key={group.label} className="flex flex-col gap-2">
              <Text
                textType={"small"}
                className="text-muted text-left uppercase tracking-widest"
                as="p"
              >
                {group.label}
              </Text>
              <div className="flex flex-row md:flex-col flex-wrap gap-2">
                {group.tracks.map((track) => {
                  const selected = trackFilter === track.name;
                  return (
                    <button
                      key={track.name}
                      type="button"
                      onClick={() =>
                        setTrackFilter(
                          selected
                            ? undefined
                            : (track.name as AgendaTrackName),
                        )
                      }
                      className={classNames(
                        "flex items-center gap-2.5 rounded-lg border py-2 px-3 text-left transition-colors w-fit md:w-full",
                        selected
                          ? track.active
                          : "border-line text-secondary hover:border-line-strong hover:text-white",
                      )}
                    >
                      <span
                        className={classNames(
                          "inline-block h-3 w-3 shrink-0 rounded-full",
                          track.dot,
                        )}
                        aria-hidden
                      />
                      <Text
                        textType={"small"}
                        className="!text-inherit text-left"
                        as="p"
                      >
                        {track.name}
                      </Text>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {anyFilter && (
          <button
            type="button"
            onClick={clearFilters}
            className="w-fit md:w-full rounded-lg border border-line px-3 py-2 text-secondary transition-colors hover:border-line-strong hover:text-white"
          >
            <Text textType={"small"} className="!text-inherit" as="p">
              Clear all filters
            </Text>
          </button>
        )}
      </div>
      <div id="sessions" className="flex w-full flex-col gap-y-4">
        <div className="flex w-full flex-col items-center md:items-start">
          {filteredSessions?.map((item, index) => {
            // --- Warnings if Strapi data is missing ---
            if (!item.title) {
              console.warn(
                `⚠️ Session at index ${index} is missing a title`,
                item,
              );
            }
            if (!item.startTime || !item.endTime) {
              console.warn(
                `⚠️ Session "${item.title ?? "?"}" has no start or end time`,
                item,
              );
            }
            if (!item.room) {
              console.warn(
                `⚠️ Session "${item.title ?? "?"}" has no room assigned`,
                item,
              );
            }
            if (!item.track) {
              console.warn(
                `⚠️ Session "${item.title ?? "?"}" has no track assigned`,
                item,
              );
            }
            if (!item.speakers || Object.keys(item.speakers).length === 0) {
              console.warn(
                `⚠️ Session "${item.title ?? "?"}" has no speakers`,
                item,
              );
            }
            // -----------------------------------------

            return (
              <React.Fragment key={index}>
                {
                  // Divider between days
                  index > 0 &&
                    new Date(filteredSessions[index - 1].startTime).getDate() <
                      new Date(item.startTime).getDate() && (
                      <Separator.Root
                        attr-text={new Date(item.startTime).toLocaleDateString(
                          "en-DE",
                          {
                            weekday: "long",
                            timeZone: "Europe/Berlin",
                          },
                        )}
                        className={classNames(
                          "h-px my-16 bg-gradient-tbc w-full text-center overflow-visible",
                          "after:bg-black after:px-4 after:relative after:-top-[0.75em]",
                          "after:content-[attr(attr-text)]",
                        )}
                      />
                    )
                }
                <SessionComponent session={item} speakers={speakers} />
              </React.Fragment>
            );
          })}

          {visibleTalksCount > 0 && <AgendaFeed entries={visibleEntries} />}

          {sessions.length === 0 &&
            (visibleTalksCount > 0 ? (
              !eventFilter &&
              !feedHasOwnFilters && (
                <div className="card-tbc-soft mt-8 flex w-full flex-col items-center gap-2 px-6 py-10 text-center">
                  <Text as="p" textType="lgsmall" className="font-bold">
                    More to come
                  </Text>
                  <Text
                    as="p"
                    textType="small"
                    className="text-secondary max-w-md"
                  >
                    The Hackathon programme is in the making and will be
                    published right here. Stay tuned!
                  </Text>
                </div>
              )
            ) : feedHasOwnFilters ? (
              <Text className="text-gray-500">
                There is no session with that filter :(
              </Text>
            ) : (
              <div className="card-tbc-soft flex w-full flex-col items-center gap-3 px-6 py-16 text-center">
                <Text as="p" textType="sub_title" className="font-bold">
                  This programme is in the making
                </Text>
                <Text
                  as="p"
                  textType="paragraph"
                  className="text-secondary max-w-md"
                >
                  We are putting it together and will publish every session
                  right here. Stay tuned!
                </Text>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
Agenda.displayName = "Agenda";

export default Agenda;
