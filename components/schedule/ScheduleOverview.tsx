import type { CSSProperties } from "react";
import Image from "next/image";
import { Text } from "@/components/text";
import confLogo from "@/public/logos/c26-wordmark.svg";
import digitalAssetsDayLogo from "@/public/logos/digital-assets-day-logo.png";
import hackathonLogo from "@/public/logos/hackathon-logo.png";

const days = [
  { day: "Day 0", date: "28.10." },
  { day: "Day 1", date: "29.10." },
  { day: "Day 2", date: "30.10." },
  { day: "Day 3", date: "31.10." },
];

const DayPill = ({ day, date }: { day: string; date: string }) => (
  <div className="w-full lg:w-auto rounded-xl border border-tbc-purple/50 px-4 py-3 lg:px-5 lg:py-4 flex lg:flex-col items-center justify-between lg:justify-center gap-1 shrink-0">
    <Text textType="lgsmall" className="font-bold whitespace-nowrap">
      {day}
    </Text>
    <Text textType="small" className="text-muted whitespace-nowrap">
      {date}
    </Text>
  </div>
);

const SideEventsCell = ({
  className = "",
  style,
  highlight = false,
}: {
  className?: string;
  style?: CSSProperties;
  highlight?: boolean;
}) => (
  <div
    style={style}
    className={`${
      highlight ? "card-tbc" : "card-tbc-soft"
    } flex items-center justify-center py-6 px-4 ${className}`}
  >
    <Text
      textType="lgsmall"
      className={`uppercase tracking-widest ${
        highlight ? "text-gradient font-bold" : "text-muted"
      }`}
    >
      Side Events
    </Text>
  </div>
);

const ScheduleOverview = ({
  highlightSideEvents = false,
}: {
  highlightSideEvents?: boolean;
}) => {
  return (
    <div className="w-full flex flex-col gap-4">
      {/* Mobile / tablet: stacked day cards */}
      <div className="flex flex-col gap-4 lg:hidden">
        <div className="flex flex-col gap-3">
          <DayPill day={days[0].day} date={days[0].date} />
          <SideEventsCell highlight={highlightSideEvents} />
        </div>

        <div className="flex flex-col gap-3">
          <DayPill day={days[1].day} date={days[1].date} />
          <div className="card-tbc flex items-center justify-center py-6 px-6">
            <Image
              src={confLogo}
              alt="TUM Blockchain Conference 26"
              className="h-10 w-auto"
            />
          </div>
          <SideEventsCell highlight={highlightSideEvents} />
        </div>

        <div className="flex flex-col gap-3">
          <DayPill day={days[2].day} date={days[2].date} />
          <div className="card-tbc flex items-center justify-center py-5 px-6">
            <Image
              src={digitalAssetsDayLogo}
              alt="Digital Assets Day"
              className="h-12 w-auto"
            />
          </div>
          <div className="card-tbc flex items-center justify-center py-6 px-6">
            <Image
              src={hackathonLogo}
              alt="TUM Blockchain Hackathon"
              className="h-14 w-auto"
            />
          </div>
          <SideEventsCell highlight={highlightSideEvents} />
        </div>

        <div className="flex flex-col gap-3">
          <DayPill day={days[3].day} date={days[3].date} />
          <div className="card-tbc-soft flex items-center justify-center py-4 px-6">
            <Text
              textType="small"
              className="uppercase tracking-widest text-faint"
            >
              Hackathon continues
            </Text>
          </div>
          <SideEventsCell highlight={highlightSideEvents} />
        </div>
      </div>

      {/* Desktop: schedule grid — day rows x [main stage / hackathon / side events] tracks */}
      <div
        className="hidden lg:grid gap-4"
        style={{
          gridTemplateColumns: "160px 1.4fr 1fr 1fr",
          gridTemplateRows: "repeat(4, minmax(110px, auto))",
        }}
      >
        {/* Day pills, one per row */}
        <div style={{ gridColumn: 1, gridRow: 1 }}>
          <DayPill day={days[0].day} date={days[0].date} />
        </div>
        <div style={{ gridColumn: 1, gridRow: 2 }}>
          <DayPill day={days[1].day} date={days[1].date} />
        </div>
        <div style={{ gridColumn: 1, gridRow: 3 }}>
          <DayPill day={days[2].day} date={days[2].date} />
        </div>
        <div style={{ gridColumn: 1, gridRow: 4 }}>
          <DayPill day={days[3].day} date={days[3].date} />
        </div>

        {/* Day 0 — nothing but side events, spans the full remaining width */}
        <SideEventsCell
          highlight={highlightSideEvents}
          style={{ gridColumn: "2 / span 3", gridRow: 1 }}
        />

        {/* Day 1 — main conference, side events fills the hackathon gap */}
        <div
          style={{ gridColumn: 2, gridRow: 2 }}
          className="card-tbc flex items-center justify-center py-6 px-6"
        >
          <Image
            src={confLogo}
            alt="TUM Blockchain Conference 26"
            className="h-12 w-auto"
          />
        </div>
        <SideEventsCell
          highlight={highlightSideEvents}
          style={{ gridColumn: "3 / span 2", gridRow: 2 }}
        />

        {/* Day 2 — Digital Assets Day, Hackathon starts (spans into Day 3), side events */}
        <div
          style={{ gridColumn: 2, gridRow: 3 }}
          className="card-tbc flex items-center justify-center py-5 px-6"
        >
          <Image
            src={digitalAssetsDayLogo}
            alt="Digital Assets Day"
            className="h-14 w-auto"
          />
        </div>
        <div
          style={{ gridColumn: 3, gridRow: "3 / span 2" }}
          className="card-tbc flex items-center justify-center py-6 px-4"
        >
          <Image
            src={hackathonLogo}
            alt="TUM Blockchain Hackathon"
            className="h-16 w-auto"
          />
        </div>
        <SideEventsCell
          highlight={highlightSideEvents}
          style={{ gridColumn: 4, gridRow: 3 }}
        />

        {/* Day 3 — Hackathon continues (cell above spans down), side events */}
        <SideEventsCell
          highlight={highlightSideEvents}
          style={{ gridColumn: 4, gridRow: 4 }}
        />
      </div>
    </div>
  );
};

export default ScheduleOverview;
