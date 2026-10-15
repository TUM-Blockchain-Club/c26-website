"use client";

import React, { createContext, useContext, useMemo } from "react";
import type {
  AgendaEntry,
  AgendaTalk,
} from "@/constants/digitalAssetsDayAgenda";
import { agendaTalks as fallbackTalks } from "@/constants/digitalAssetsDayAgenda";
import {
  bareName,
  speakerLinkFor as staticSpeakerLinkFor,
  type SpeakerLink,
} from "@/util/speakerPortraits";

/**
 * The live programme, handed from the server to the parts of the agenda that
 * run in the browser.
 *
 * The agenda and the speakers come from Strapi, which can only be read on the
 * server, while the feed's filters, the session dialog and the speaker faces
 * run in the browser. Rather than thread the whole programme through a dozen
 * component props, a page fetches once and puts it here.
 *
 * Without a provider every reader falls back to the lists compiled into the
 * bundle, so a component rendered outside the agenda pages still shows the
 * same thing it showed before Strapi fed it.
 */
export type AgendaData = {
  entries: AgendaEntry[];
  /** Everything the agenda knows about the people on stage. */
  speakers: SpeakerLink[];
};

const AgendaDataContext = createContext<AgendaData | null>(null);

export const AgendaDataProvider = ({
  data,
  children,
}: {
  data: AgendaData;
  children: React.ReactNode;
}) => (
  <AgendaDataContext.Provider value={data}>
    {children}
  </AgendaDataContext.Provider>
);

/** The whole programme, as the feed and the stage grids filter it. */
export const useAgendaEntries = (): AgendaEntry[] =>
  useContext(AgendaDataContext)?.entries ?? [];

/** One session by its permalink, for the dialog the URL opens. */
export const useTalkById = (id?: string): AgendaTalk | undefined => {
  const data = useContext(AgendaDataContext);
  const byId = useMemo(() => {
    const talks = data
      ? data.entries.filter((e): e is AgendaTalk => e.kind === "talk")
      : fallbackTalks;
    return new Map(talks.map((t) => [t.id, t]));
  }, [data]);
  return id ? byId.get(id) : undefined;
};

/** True if the id belongs to a session, for validating a URL. */
export const useHasTalk = (): ((id: string) => boolean) => {
  const data = useContext(AgendaDataContext);
  const ids = useMemo(() => {
    const talks = data
      ? data.entries.filter((e): e is AgendaTalk => e.kind === "talk")
      : fallbackTalks;
    return new Set(talks.map((t) => t.id));
  }, [data]);
  return (id: string) => ids.has(id);
};

/**
 * Looks up a speaker by the name the agenda spells, the same way
 * util/speakerPortraits.ts does: academic titles dropped, whitespace and
 * accents folded, everything else exact, so a near miss stays a silhouette
 * rather than showing a stranger.
 */
export const useSpeakerLookup = (): ((
  name: string,
) => SpeakerLink | undefined) => {
  const data = useContext(AgendaDataContext);
  const byName = useMemo(
    () =>
      data ? new Map(data.speakers.map((s) => [bareName(s.name), s])) : null,
    [data],
  );
  return (name: string) =>
    byName ? byName.get(bareName(name)) : staticSpeakerLinkFor(name);
};
