import classNames from "classnames";
import { Text } from "@/components/text";
import {
  DAD_TRACKS,
  agendaEntries,
  type AgendaEntry,
} from "@/constants/digitalAssetsDayAgenda";

const trackStyle = (name: string) =>
  DAD_TRACKS.find((t) => t.name === name) ?? DAD_TRACKS[DAD_TRACKS.length - 1];

type Talk = Extract<AgendaEntry, { kind: "talk" }>;

const dadTalks = agendaEntries.filter(
  (e): e is Talk => e.kind === "talk" && e.event === "digital-assets-day",
);

const STAGES = [
  { name: "Main Stage", subtitle: "Classic conference set up" },
  {
    name: "Executive Forum",
    subtitle: "Interactive and curated deep dive formats",
  },
] as const;

const SessionRow = ({ talk }: { talk: Talk }) => {
  const style = trackStyle(talk.track);
  return (
    <div
      className={classNames(
        "flex flex-col gap-2 rounded-lg border border-line border-l-4 bg-white/[0.02] px-4 py-3.5",
        style.accent,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <Text as="p" textType="small" className="font-bold text-white">
          {talk.time}
        </Text>
        {talk.format && (
          <Text as="p" textType="small" className="text-faint">
            {talk.format}
          </Text>
        )}
      </div>
      <Text as="p" textType="lgsmall" className="font-bold leading-snug">
        {talk.title ?? "Title to be announced"}
      </Text>
      <div className="flex items-center gap-2">
        <span
          className={classNames("h-2 w-2 shrink-0 rounded-full", style.dot)}
          aria-hidden
        />
        <Text as="span" textType="small" className="text-secondary">
          {talk.track}
        </Text>
      </div>
    </div>
  );
};

const Band = ({ time, label }: { time: string; label: string }) => (
  <div className="flex flex-wrap items-center justify-center gap-2 rounded-lg border border-blue-400/40 bg-blue-400/[0.07] px-4 py-3 text-center">
    <Text as="span" textType="small" className="font-bold text-blue-200">
      {time}
    </Text>
    <Text
      as="span"
      textType="small"
      className="uppercase tracking-widest text-secondary"
    >
      {label}
    </Text>
  </div>
);

export const DigitalAssetsDayAgenda = () => {
  return (
    <div className="flex flex-col gap-6">
      <Band time="8:00" label="Doors Open & Arrival" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {STAGES.map((stage) => {
          const talks = dadTalks.filter((t) => t.stage === stage.name);
          return (
            <div key={stage.name} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1 border-b border-blue-400/30 pb-3">
                <Text
                  as="p"
                  textType="sub_title"
                  className="font-bold text-blue-200"
                >
                  {stage.name}
                </Text>
                <Text as="p" textType="small" className="text-muted">
                  {stage.subtitle}
                </Text>
              </div>
              <div className="flex flex-col gap-2.5">
                {talks.map((talk, i) => (
                  <SessionRow key={i} talk={talk} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Band time="19:00" label="Evening Event (until 22:00)" />

      <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1">
        {DAD_TRACKS.map((track) => (
          <span key={track.name} className="flex items-center gap-2">
            <span
              className={classNames("h-2.5 w-2.5 rounded-full", track.dot)}
              aria-hidden
            />
            <Text as="span" textType="small" className="text-secondary">
              {track.name}
            </Text>
          </span>
        ))}
      </div>
    </div>
  );
};

export default DigitalAssetsDayAgenda;
