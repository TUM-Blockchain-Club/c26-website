import {
  Code,
  Globe,
  GraduationCap,
  Heart,
  Landmark,
  MapPin,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { StageSponsor } from "@/components/stage/stageData";

/**
 * The opening ceremony's slides, built into the stage screen rather than
 * uploaded as a PDF, so they animate and lay themselves out on any wall
 * (2880 x 1026 on Nakamoto). Content follows the "C26 Opening" deck in
 * Figma; the background stays the screen's own ring.
 *
 * They follow "On stage" for the session below, one press each, unless a PDF
 * was uploaded for it, which then wins as for every other session. Figma's
 * first slide (the two hosts) is what "On stage" already shows.
 */
export const OPENING_SESSION = "conference-opening";

export const OPENING_SLIDES = [
  "title",
  "story",
  "y2023",
  "y2024",
  "y2025",
  "y2026",
  "why",
  "goals",
  "agenda",
  "stages",
  "qr",
  "sponsors",
  "organizers",
] as const;
export type OpeningSlideId = (typeof OPENING_SLIDES)[number];

const IMG = "/stage/opening";

/** Pictures the slides use, for the screen to fetch ahead of the cue. */
export const OPENING_IMAGES = [
  "/logos/c26-wordmark.svg",
  "/logos/c24-sticker-1.png",
  "/logos/tbc-wordmark.svg",
  `${IMG}/year-2023.jpg`,
  `${IMG}/year-2024.jpg`,
  `${IMG}/year-2025.jpg`,
  `${IMG}/hackathon-script.png`,
  `${IMG}/plan-ground.png`,
  `${IMG}/plan-first.png`,
  `${IMG}/qr-agenda.png`,
];

type Year = {
  id: OpeningSlideId;
  year: string;
  title: string;
  stats: string;
  text?: string;
  photo?: string;
};

const YEARS: Year[] = [
  {
    id: "y2023",
    year: "2023",
    title: "Where it started",
    stats: "1st edition",
    text: "For the first time, students organized a conference this large, built on the belief that Munich is the place to be.",
    photo: `${IMG}/year-2023.jpg`,
  },
  {
    id: "y2024",
    year: "2024",
    title: "Deutsches Museum",
    stats: "1,000+ visitors | 100 talks",
    text: "We expanded into the Deutsches Museum.",
    photo: `${IMG}/year-2024.jpg`,
  },
  {
    id: "y2025",
    year: "2025",
    title: "House of Communication",
    stats: "1,100+ attendees | 125+ speakers",
    text: "A new venue, so we could grow even further.",
    photo: `${IMG}/year-2025.jpg`,
  },
  {
    id: "y2026",
    year: "2026",
    title: "Our biggest step yet",
    stats: "3 days | +1 hackathon",
  },
];

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="stg-label op-rise" style={d(0.1)}>
    <i aria-hidden />
    {children}
  </span>
);

/** An icon in a ring that draws itself round. */
const Glyph = ({ Icon, delay }: { Icon: LucideIcon; delay: number }) => (
  <span className="op-glyph op-pop" style={d(delay)}>
    <svg viewBox="0 0 100 100" aria-hidden>
      <defs>
        <linearGradient id="op-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--a)" />
          <stop offset=".55" stopColor="var(--b)" />
          <stop offset="1" stopColor="var(--c)" />
        </linearGradient>
      </defs>
      <circle
        cx="50"
        cy="50"
        r="47"
        pathLength={1}
        className="op-ring-draw"
        style={d(delay + 0.1)}
      />
    </svg>
    <Icon strokeWidth={1.4} aria-hidden />
  </span>
);

/** The brand mark as the 2026 "photo": sticker and wordmark. */
const Brand = ({ delay = 0.5 }: { delay?: number }) => (
  <div className="op-brand">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="/logos/c24-sticker-1.png"
      alt=""
      className="op-sticker op-spin-in"
      style={d(delay)}
    />
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="/logos/c26-wordmark.svg"
      alt="TUM Blockchain Conference 26 and Hackathon"
      className="op-wordmark op-rise"
      style={d(delay + 0.25)}
    />
  </div>
);

const Title = () => (
  <section className="stg-scene op op-title">
    <Brand delay={0.4} />
    <span className="op-rule op-draw" style={d(1.1)} aria-hidden />
    <p className="op-date op-rise" style={d(1.3)}>
      29 to 31 October <b>|</b> House of Communication
    </p>
  </section>
);

const Story = () => (
  <section className="stg-scene op op-story">
    <Label>Our story</Label>
    <div className="op-timeline">
      <span className="op-line op-draw" style={d(0.4)} aria-hidden />
      <ol>
        {YEARS.map((y, i) => (
          <li key={y.year} className={y.photo ? undefined : "is-now"}>
            <span className="op-chip op-rise" style={d(0.5 + i * 0.22)}>
              {y.year}
            </span>
            <span className="op-dot op-pop" style={d(0.6 + i * 0.22)} />
            <div className="op-card op-rise" style={d(0.8 + i * 0.22)}>
              <div className="op-card-media">
                {y.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={y.photo} alt="" />
                ) : (
                  <Brand delay={1.6} />
                )}
              </div>
              <div className="op-card-text">
                <strong>{y.title}</strong>
                <span>{y.stats}</span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

const YearSlide = ({ y }: { y: Year }) => (
  <section className="stg-scene op op-year">
    <div className="op-year-text">
      <Label>Our story</Label>
      <span className="op-year-num op-rise" style={d(0.3)}>
        {y.year}
      </span>
      <h1 className="op-year-title op-rise" style={d(0.5)}>
        {y.title}
      </h1>
      <p className="op-year-stats op-rise" style={d(0.65)}>
        {y.stats}
      </p>
      {y.text && (
        <p className="op-year-desc op-rise" style={d(0.8)}>
          {y.text}
        </p>
      )}
      <ol className="op-mini op-rise" style={d(1)} aria-hidden>
        {YEARS.map((m) => (
          <li key={m.year} className={m.year === y.year ? "is-on" : undefined}>
            {m.year}
          </li>
        ))}
      </ol>
    </div>
    <div className={`op-year-media ${y.photo ? "" : "is-brand"}`}>
      {y.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={y.photo} alt="" className="op-kenburns" />
      ) : (
        <Brand delay={0.5} />
      )}
    </div>
  </section>
);

const Why = () => (
  <section className="stg-scene op op-why">
    <Label>Why we do this</Label>
    <p className="op-statement op-rise" style={d(0.35)}>
      Bringing the next generation of builders and thinkers in Web3 together, in
      a non-profit setting where technology and open discourse take center
      stage.
    </p>
    <ul className="op-pillars">
      {(
        [
          [GraduationCap, "Run by students"],
          [Heart, "Non-profit"],
          [Globe, "Open to everyone"],
        ] as const
      ).map(([Icon, text], i) => (
        <li key={text}>
          <Glyph Icon={Icon} delay={0.9 + i * 0.2} />
          <span className="op-rise" style={d(1.05 + i * 0.2)}>
            {text}
          </span>
        </li>
      ))}
    </ul>
  </section>
);

const Goals = () => (
  <section className="stg-scene op op-goals">
    <Label>What we want to achieve</Label>
    <ol className="op-goal-list">
      {(
        [
          [Users, "Connect students with the industry"],
          [Landmark, "Bring Europe’s institutions to the table"],
          [Code, "Turn ideas into code"],
          [MapPin, "Make Munich a home for Web3"],
        ] as const
      ).map(([Icon, text], i) => (
        <li key={text}>
          <Glyph Icon={Icon} delay={0.4 + i * 0.2} />
          <span className="op-goal-no op-rise" style={d(0.6 + i * 0.2)}>
            0{i + 1}
          </span>
          <span className="op-goal-text op-rise" style={d(0.7 + i * 0.2)}>
            {text}
          </span>
        </li>
      ))}
    </ol>
  </section>
);

const Agenda = () => (
  <section className="stg-scene op op-agenda">
    <Label>Agenda</Label>
    <div className="op-agenda-grid">
      <span />
      {["Day 1 | Thu 29.10.", "Day 2 | Fri 30.10.", "Day 3 | Sat 31.10."].map(
        (t, i) => (
          <span key={t} className="op-day op-rise" style={d(0.35 + i * 0.12)}>
            {t}
          </span>
        ),
      )}
      <span className="op-row-label op-rise" style={d(0.7)}>
        Conference
      </span>
      <div className="op-box op-rise" style={d(0.8)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logos/c26-wordmark-no-hackathon.svg"
          alt="TUM Blockchain Conference 26"
          className="op-box-c26"
        />
      </div>
      <div className="op-box op-rise" style={d(0.95)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logos/digital-assets-day-logo.png"
          alt="Digital Assets Day by Bundesblock"
          className="op-box-dad"
        />
      </div>
      <span />
      <span className="op-row-label op-rise" style={d(1.1)}>
        Hackathon
      </span>
      <span />
      <div className="op-box op-hack op-wipe" style={d(1.25)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${IMG}/hackathon-script.png`}
          alt="Hackathon"
          className="op-box-hack"
        />
        <span className="op-hack-text">
          <strong>30 to 31 October</strong>
          <span>Winners and closing: Sat 17:30</span>
        </span>
      </div>
    </div>
  </section>
);

type Pin = { n: number; name: string; x: number; y: number; left?: boolean };

const Plan = ({
  title,
  src,
  ratio,
  pins,
  delay,
}: {
  title: string;
  src: string;
  ratio: string;
  pins: Pin[];
  delay: number;
}) => (
  <figure className="op-plan op-rise" style={d(delay)}>
    <figcaption>{title}</figcaption>
    <div className="op-plan-img" style={{ aspectRatio: ratio }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" />
      {pins.map((p, i) => (
        <span
          key={p.n}
          className={`op-pin ${p.left ? "is-left" : ""}`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            ...d(delay + 0.5 + i * 0.15),
          }}
        >
          <i className="op-halo" aria-hidden />
          <b>{p.n}</b>
          <em>{p.name}</em>
        </span>
      ))}
    </div>
  </figure>
);

const STAGES = [
  ["Nakamoto", "Main stage, both days", "LAB Lounge, ground floor"],
  [
    "Turing",
    "Day 1: Research | Day 2: Executive Forum",
    "Konferenz 9+10, straight up the stairs",
  ],
  [
    "Hopper",
    "Day 1: Hopper | Day 2: Future Stage",
    "Worklab 2, next to the main stage",
  ],
  ["GERN", "Entrance, expo and hackathon", "Ground floor, Friedenstraße"],
] as const;

const Stages = () => (
  <section className="stg-scene op op-stages">
    <Label>Stages</Label>
    <div className="op-stage-grid">
      <Plan
        title="Ground floor"
        src={`${IMG}/plan-ground.png`}
        ratio="1010 / 446"
        delay={0.35}
        pins={[
          { n: 1, name: "Nakamoto", x: 78.3, y: 50.2 },
          { n: 3, name: "Hopper", x: 70.3, y: 22.9, left: true },
          { n: 4, name: "GERN", x: 19.6, y: 58.3 },
        ]}
      />
      <Plan
        title="1st floor | up the stairs"
        src={`${IMG}/plan-first.png`}
        ratio="440 / 446"
        delay={0.5}
        pins={[{ n: 2, name: "Turing", x: 50.5, y: 83.8 }]}
      />
      <ol className="op-legend">
        {STAGES.map(([name, what, where], i) => (
          <li key={name} className="op-rise" style={d(0.9 + i * 0.12)}>
            <b>{i + 1}</b>
            <strong>{name}</strong>
            <span>{what}</span>
            <span className="op-legend-where">{where}</span>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

const Qr = () => (
  <section className="stg-scene op op-qr">
    <Label>Current sessions at a glance</Label>
    <div className="op-qr-row">
      <div className="op-qr-tile op-pop" style={d(0.4)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${IMG}/qr-agenda.png`} alt="QR code to the agenda" />
      </div>
      <div className="op-qr-text">
        <h1 className="op-rise" style={d(0.6)}>
          Build your own agenda
        </h1>
        <p className="op-rise" style={d(0.75)}>
          Scan to see every session, stage and speaker, and plan your three
          days.
        </p>
        <p className="op-url op-rise" style={d(0.9)}>
          conference26.tum-blockchain.com/agenda
        </p>
      </div>
    </div>
  </section>
);

/** Rows of the sponsor slide, in the deck's order. Tiers without a sponsor
 * in Strapi drop out. */
const SPONSOR_ROWS: { size: string; groups: [string, string[]][] }[] = [
  {
    size: "is-lg",
    groups: [
      ["Platinum", ["platinum"]],
      ["Gold", ["gold"]],
      ["Premium", ["premium"]],
    ],
  },
  { size: "is-md", groups: [["Silver", ["silver"]]] },
  { size: "is-sm", groups: [["Bronze", ["bronze"]]] },
  {
    size: "is-sm",
    groups: [
      ["Tracks", ["track"]],
      ["Bounty", ["bounty"]],
    ],
  },
];

/** Every sponsor, row by row by tier; also shown in the lunch break and at
 * the end of each day. */
export const SponsorWall = ({
  sponsors,
  delay = 0.4,
}: {
  sponsors: StageSponsor[];
  delay?: number;
}) => {
  let n = 0;
  return (
    <div className="op-sponsor-rows">
      {SPONSOR_ROWS.map((row, r) => {
        const groups = row.groups
          .map(
            ([label, tiers]) =>
              [label, sponsors.filter((s) => tiers.includes(s.tier))] as const,
          )
          .filter(([, list]) => list.length);
        if (!groups.length) return null;
        return (
          <div key={r} className={`op-sponsor-row ${row.size}`}>
            {groups.map(([label, list]) => (
              <div key={label} className="op-sponsor-group">
                <span className="op-tier op-rise" style={d(delay + r * 0.15)}>
                  {label}
                </span>
                {list.map((s) => (
                  <span
                    key={s.name}
                    className={`op-logo op-pop ${s.light ? "" : "is-dark"}`}
                    style={d(delay + 0.1 + r * 0.15 + n++ * 0.04)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.src} alt={s.name} />
                  </span>
                ))}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

const Sponsors = ({ sponsors }: { sponsors: StageSponsor[] }) => (
  <section className="stg-scene op op-sponsors">
    <Label>Thank you to our sponsors</Label>
    <SponsorWall sponsors={sponsors} />
  </section>
);

const Organizers = () => (
  <section className="stg-scene op op-org">
    <Label>Organized by</Label>
    <div className="op-org-row">
      <div className="op-org-side">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logos/tbc-wordmark.svg"
          alt="TUM Blockchain Club"
          className="op-org-tbc op-rise"
          style={d(0.4)}
        />
        <p className="op-org-claim op-rise" style={d(0.6)}>
          Education <b>|</b> Network <b>|</b> Support
        </p>
      </div>
      <span className="op-org-divider op-grow" style={d(0.8)} aria-hidden />
      <div className="op-org-side">
        <p className="op-org-cap op-rise" style={d(1)}>
          Digital Assets Day curated by
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logos/digital-assets-day-logo.png"
          alt="Digital Assets Day by Bundesblock"
          className="op-org-dad op-rise"
          style={d(1.15)}
        />
        <p className="op-org-day op-rise" style={d(1.3)}>
          Friday 30 October
        </p>
      </div>
    </div>
  </section>
);

export const OpeningSlide = ({
  id,
  sponsors,
}: {
  id: OpeningSlideId;
  sponsors: StageSponsor[];
}) => {
  const year = YEARS.find((y) => y.id === id);
  if (year) return <YearSlide y={year} />;
  switch (id) {
    case "title":
      return <Title />;
    case "story":
      return <Story />;
    case "why":
      return <Why />;
    case "goals":
      return <Goals />;
    case "agenda":
      return <Agenda />;
    case "stages":
      return <Stages />;
    case "qr":
      return <Qr />;
    case "sponsors":
      return <Sponsors sponsors={sponsors} />;
    case "organizers":
      return <Organizers />;
    default:
      return null;
  }
};

/* Everything is sized in the screen's unit --u, so the slides scale with
   the wall like the rest of the screen; the wide walls simply get wider rows.
   Motion is short rises, fades and lines that draw, staggered by --d. */
export const OPENING_CSS = `
/* clip, so the rise animations starting lower down never read as overflow
   to the screen's shrink-to-fit; the margin keeps descenders and halos */
.op{--ease:cubic-bezier(.22,.61,.36,1);gap:calc(var(--u)*2);overflow:clip;overflow-clip-margin:calc(var(--u)*2)}
.op-rise{animation:op-rise 1s var(--ease) both;animation-delay:var(--d,0s)}
.op-pop{animation:op-pop .9s var(--ease) both;animation-delay:var(--d,0s)}
.op-draw{transform-origin:0 50%;animation:op-draw 1.4s cubic-bezier(.65,0,.25,1) both;animation-delay:var(--d,0s)}
.op-grow{transform-origin:50% 0;animation:op-grow 1.2s cubic-bezier(.65,0,.25,1) both;animation-delay:var(--d,0s)}
.op-wipe{animation:op-wipe 1.3s cubic-bezier(.65,0,.25,1) both;animation-delay:var(--d,0s)}
.op-spin-in{animation:op-spin-in 1.4s var(--ease) both;animation-delay:var(--d,0s)}
@keyframes op-rise{from{opacity:0;transform:translateY(calc(var(--u)*1.2*var(--rise,1)))}to{opacity:1;transform:none}}
@keyframes op-pop{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:none}}
@keyframes op-draw{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes op-grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes op-wipe{from{clip-path:inset(0 100% 0 0);opacity:.4}to{clip-path:inset(0 0 0 0);opacity:1}}
@keyframes op-spin-in{from{opacity:0;transform:rotate(-70deg) scale(.85)}to{opacity:1;transform:none}}
@keyframes op-ring{to{stroke-dashoffset:0}}
@keyframes op-halo{0%{transform:translate(-50%,-50%) scale(.6);opacity:.7}100%{transform:translate(-50%,-50%) scale(1.6);opacity:0}}
@keyframes op-kenburns{from{transform:scale(1.08)}to{transform:scale(1)}}
.op .stg-label{margin-bottom:calc(var(--u)*.6)}
.op-grad{background:linear-gradient(100deg,var(--a),var(--b) 55%,var(--c));-webkit-background-clip:text;background-clip:text;color:transparent}

/* brand mark */
.op-brand{display:flex;align-items:center;justify-content:center;gap:calc(var(--u)*3)}
.op-sticker{height:calc(var(--u)*15*var(--fit,1));width:auto}
.op-wordmark{height:calc(var(--u)*16*var(--fit,1));width:auto}

/* title */
.op-title{justify-content:center;align-items:center}
.op-rule{display:block;width:calc(var(--u)*40);height:2px;margin-top:calc(var(--u)*2.4);background:linear-gradient(90deg,var(--a),var(--b),var(--c))}
.op-date{margin:calc(var(--u)*1.6) 0 0;font-size:calc(var(--u)*2.2);font-weight:600;color:var(--mute)}
.op-date b,.op-org-claim b{font-weight:400;opacity:.5;margin:0 .4em}

/* timeline */
.op-timeline{position:relative;flex:1;min-height:0;display:flex}
.op-line{position:absolute;left:0;right:0;top:calc(var(--u)*3.9);height:2px;background:linear-gradient(90deg,var(--a),var(--b) 60%,var(--c))}
.op-timeline ol{list-style:none;margin:0;padding:0;flex:1;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:calc(var(--u)*2.4)}
.op-timeline li{display:flex;flex-direction:column;align-items:center;min-width:0}
.op-chip{font-weight:700;font-size:calc(var(--u)*1.5);padding:calc(var(--u)*.45) calc(var(--u)*2.4);border:1px solid color-mix(in srgb,var(--c) 70%,transparent);border-radius:calc(var(--u)*.6);background:rgba(10,9,12,.85)}
.op-dot{width:calc(var(--u)*1.1);height:calc(var(--u)*1.1);border-radius:50%;margin:calc(var(--u)*.6) 0 calc(var(--u)*1.4);background:var(--b);box-shadow:0 0 0 calc(var(--u)*.35) rgba(244,67,54,.18)}
.op-card{width:100%;flex:1;min-height:0;display:flex;flex-direction:column;border-radius:calc(var(--u)*.8);overflow:hidden;background:rgba(22,20,28,.88);border:1px solid var(--line)}
.is-now .op-card{border-color:transparent;background:linear-gradient(rgba(22,20,28,.94),rgba(22,20,28,.94)) padding-box,linear-gradient(120deg,var(--a),var(--b),var(--c)) border-box;border:2px solid transparent}
.op-card-media{flex:1;min-height:0;position:relative;overflow:hidden;background:#100f14}
.op-card-media > img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.op-card-media .op-brand{position:absolute;inset:0;gap:calc(var(--u)*1.2)}
.op-card-media .op-sticker{height:46%}
.op-card-media .op-wordmark{height:52%}
.op-card-text{display:flex;flex-direction:column;gap:calc(var(--u)*.35);padding:calc(var(--u)*1.2) calc(var(--u)*1.4) calc(var(--u)*1.4)}
.op-card-text strong{font-size:calc(var(--u)*1.7);font-weight:800;line-height:1.15}
.op-card-text span{font-size:calc(var(--u)*1.25);font-weight:600;color:var(--b)}

/* one year */
.op-year{flex-direction:row;gap:calc(var(--u)*4)}
.op-year-text{flex:0 0 auto;width:calc(var(--u)*52);display:flex;flex-direction:column;justify-content:center;min-width:0}
.op-year-num{font-weight:800;font-size:calc(var(--u)*9*var(--fit,1));line-height:1;letter-spacing:-.03em;padding-bottom:.08em;background:linear-gradient(100deg,var(--a),var(--b) 55%,var(--c));-webkit-background-clip:text;background-clip:text;color:transparent}
.op-year-title{margin:calc(var(--u)*.8) 0 0;font-weight:800;font-size:calc(var(--u)*3.6*var(--fit,1));line-height:1.1;letter-spacing:-.02em;text-wrap:balance;padding-bottom:.08em}
.op-year-stats{margin:calc(var(--u)*.8) 0 0;font-size:calc(var(--u)*1.8);font-weight:700;color:var(--b)}
.op-year-desc{margin:calc(var(--u)*1.2) 0 0;font-size:calc(var(--u)*1.6);line-height:1.4;color:var(--mute);max-width:calc(var(--u)*48)}
.op-mini{list-style:none;margin:calc(var(--u)*2.4) 0 0;padding:0;display:flex;gap:calc(var(--u)*1.6);font-size:calc(var(--u)*1.25);font-weight:700;color:rgba(245,243,247,.4)}
.op-mini li{position:relative;padding-top:calc(var(--u)*.8)}
.op-mini li::before{content:"";position:absolute;left:0;right:0;top:0;height:2px;background:rgba(245,243,247,.18)}
.op-mini li.is-on{color:var(--ink)}
.op-mini li.is-on::before{background:linear-gradient(90deg,var(--a),var(--b))}
.op-year-media{flex:1;min-width:0;position:relative;overflow:hidden;border-radius:calc(var(--u)*1);animation:op-pop 1.2s var(--ease) .2s both;border:1px solid var(--line)}
.op-year-media > img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.op-kenburns{animation:op-kenburns 14s cubic-bezier(.2,.6,.2,1) both}
.op-year-media::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(10,9,12,.35),transparent 30%)}
.op-year-media.is-brand{background:radial-gradient(120% 120% at 80% 0%,rgba(111,61,226,.35),transparent 60%),radial-gradient(100% 100% at 0% 100%,rgba(244,67,54,.28),transparent 60%),#121016}
.op-year-media.is-brand .op-brand{position:absolute;inset:0}
.op-year-media.is-brand::after{display:none}

/* why */
.op-why{justify-content:center}
.op-statement{margin:0;font-weight:800;font-size:calc(var(--u)*4.3*var(--fit,1));line-height:1.18;letter-spacing:-.015em;max-width:calc(var(--u)*100);text-wrap:balance}
.op-pillars{list-style:none;margin:calc(var(--u)*3.4) 0 0;padding:0;display:flex;gap:calc(var(--u)*7)}
.op-pillars li{display:flex;align-items:center;gap:calc(var(--u)*1.6);font-size:calc(var(--u)*2);font-weight:700}
.op-glyph{position:relative;flex:none;width:calc(var(--u)*7.5);height:calc(var(--u)*7.5);display:grid;place-items:center}
.op-glyph svg{position:absolute;inset:0;width:100%;height:100%;transform:rotate(-90deg)}
.op-ring-draw{fill:rgba(10,9,12,.6);stroke:url(#op-ring);stroke-width:2.2;stroke-dasharray:1;stroke-dashoffset:1;animation:op-ring 1.4s cubic-bezier(.65,0,.25,1) both;animation-delay:var(--d,0s)}
.op-glyph > svg + svg{position:relative;inset:auto;width:42%;height:42%;transform:none;color:var(--ink)}

/* goals */
.op-goals{justify-content:center}
.op-goal-list{list-style:none;margin:calc(var(--u)*1.4) 0 0;padding:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:calc(var(--u)*3)}
.op-goal-list li{display:flex;flex-direction:column;align-items:flex-start;gap:calc(var(--u)*1)}
.op-goal-list .op-glyph{width:calc(var(--u)*9*var(--fit,1));height:calc(var(--u)*9*var(--fit,1));margin-bottom:calc(var(--u)*.6)}
.op-goal-no{font-weight:800;font-size:calc(var(--u)*2.2);color:var(--b)}
.op-goal-text{font-weight:800;font-size:calc(var(--u)*2.5);line-height:1.2;max-width:calc(var(--u)*30);text-wrap:balance}

/* agenda */
.op-agenda{justify-content:center}
.op-agenda-grid{display:grid;grid-template-columns:calc(var(--u)*14) repeat(3,minmax(0,1fr));grid-template-rows:auto calc(var(--u)*11*var(--fit,1)) calc(var(--u)*9*var(--fit,1));gap:calc(var(--u)*1.4) calc(var(--u)*1.6);align-items:stretch}
.op-day{align-self:center;text-align:center;font-weight:700;font-size:calc(var(--u)*1.5);padding:calc(var(--u)*.6) 0;border:1px solid color-mix(in srgb,var(--c) 70%,transparent);border-radius:calc(var(--u)*.6)}
.op-row-label{align-self:center;font-weight:700;font-size:calc(var(--u)*1.4);color:var(--b);letter-spacing:.04em;text-transform:uppercase}
.op-box{display:flex;align-items:center;justify-content:center;border-radius:calc(var(--u)*.8);background:rgba(28,26,34,.9);border:1px solid var(--line);min-width:0;overflow:hidden}
.op-box-c26{height:58%;width:auto}
.op-box-dad{width:72%;height:auto}
.op-hack{grid-column:3 / span 2;justify-content:flex-start;gap:calc(var(--u)*4);padding:0 calc(var(--u)*3);border:2px solid transparent;background:linear-gradient(rgba(28,26,34,.92),rgba(28,26,34,.92)) padding-box,linear-gradient(100deg,var(--a),var(--b),var(--c)) border-box}
.op-box-hack{height:46%;width:auto}
.op-hack-text{display:flex;flex-direction:column;gap:calc(var(--u)*.5)}
.op-hack-text strong{font-size:calc(var(--u)*2.2);font-weight:800}
.op-hack-text span{font-size:calc(var(--u)*1.4);color:var(--mute)}

/* stages */
.op-stage-grid{flex:1;min-height:0;display:flex;gap:calc(var(--u)*2);align-items:stretch}
.op-plan{margin:0;display:flex;flex-direction:column;gap:calc(var(--u)*.8);padding:calc(var(--u)*1.2);border-radius:calc(var(--u)*.8);background:rgba(22,20,28,.9);border:1px solid var(--line);min-width:0}
.op-plan figcaption{font-weight:800;font-size:calc(var(--u)*1.4);color:var(--b);letter-spacing:.04em;text-transform:uppercase}
.op-plan-img{position:relative;height:calc(var(--u)*26*var(--fit,1));max-width:100%}
.op-plan-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}
.op-pin{position:absolute;display:flex;align-items:center;gap:calc(var(--u)*.6);transform:translate(calc(var(--u)*-1.3),-50%);animation:op-pop .8s var(--ease) both;animation-delay:var(--d,0s)}
.op-pin.is-left{flex-direction:row-reverse;transform:translate(calc(-100% + var(--u)*1.3),-50%)}
.op-pin b{position:relative;z-index:1;width:calc(var(--u)*2.6);height:calc(var(--u)*2.6);border-radius:50%;display:grid;place-items:center;font-size:calc(var(--u)*1.3);font-weight:800;color:#fff;background:linear-gradient(135deg,var(--a),var(--b))}
.op-halo{position:absolute;left:calc(var(--u)*1.3);top:50%;width:calc(var(--u)*5.6);height:calc(var(--u)*5.6);border-radius:50%;background:radial-gradient(circle,rgba(244,67,54,.55),rgba(244,67,54,0) 70%);animation:op-halo 2.6s ease-out infinite}
.op-pin.is-left .op-halo{left:auto;right:calc(var(--u)*-1.3)}
.op-pin em{font-style:normal;font-weight:800;font-size:calc(var(--u)*1.25);padding:calc(var(--u)*.3) calc(var(--u)*.8);border-radius:calc(var(--u)*.4);background:rgba(10,9,12,.9);border:1px solid var(--line);white-space:nowrap}
.op-legend{list-style:none;margin:0;padding:0;flex:1;min-width:calc(var(--u)*30);display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:calc(var(--u)*1.2)}
.op-legend li{display:grid;grid-template-columns:auto 1fr;align-content:center;column-gap:calc(var(--u)*1);row-gap:calc(var(--u)*.3);padding:calc(var(--u)*1.2) calc(var(--u)*1.4);border-radius:calc(var(--u)*.8);background:rgba(22,20,28,.9);border:1px solid var(--line)}
.op-legend b{grid-row:span 3;width:calc(var(--u)*2.4);height:calc(var(--u)*2.4);border-radius:50%;display:grid;place-items:center;font-size:calc(var(--u)*1.2);font-weight:800;background:linear-gradient(135deg,var(--a),var(--b))}
.op-legend strong{font-size:calc(var(--u)*1.8);font-weight:800}
.op-legend span{font-size:calc(var(--u)*1.2);line-height:1.3;color:var(--mute)}
.op-legend .op-legend-where{color:rgba(245,243,247,.6)}

/* qr */
.op-qr{justify-content:center}
.op-qr-row{display:flex;align-items:center;gap:calc(var(--u)*5)}
.op-qr-tile{flex:none;width:calc(var(--u)*26*var(--fit,1));height:calc(var(--u)*26*var(--fit,1));padding:calc(var(--u)*1.8);box-sizing:border-box;border-radius:calc(var(--u)*1.2);background:#fff}
.op-qr-tile img{display:block;width:100%;height:100%;image-rendering:pixelated}
.op-qr-text h1{margin:0;font-weight:800;font-size:calc(var(--u)*4.6);letter-spacing:-.02em;line-height:1.1;padding-bottom:.08em}
.op-qr-text p{margin:calc(var(--u)*1.2) 0 0;font-size:calc(var(--u)*2);line-height:1.4;color:var(--mute);max-width:calc(var(--u)*60)}
.op-qr-text .op-url{margin-top:calc(var(--u)*2.4);font-weight:800;font-size:calc(var(--u)*2.2);color:var(--b)}

/* sponsors */
.op-sponsors{justify-content:flex-start}
.op-sponsor-rows{display:flex;flex-direction:column;gap:calc(var(--u)*1.2*var(--fit,1))}
.op-sponsor-row{display:flex;flex-wrap:wrap;gap:calc(var(--u)*1) calc(var(--u)*3)}
.op-sponsor-group{display:flex;align-items:stretch;gap:calc(var(--u)*1)}
.op-tier{flex:none;display:grid;place-items:center;min-width:calc(var(--u)*10);font-size:calc(var(--u)*1.5)!important;padding:0 calc(var(--u)*1);font-weight:700;font-size:calc(var(--u)*1.3);border:1px solid color-mix(in srgb,var(--c) 70%,transparent);border-radius:calc(var(--u)*.6);background:rgba(10,9,12,.8)}
.op-logo{display:flex;align-items:center;justify-content:center;border-radius:calc(var(--u)*.6);background:#fff;box-sizing:border-box;overflow:hidden}
.op-logo.is-dark{background:#16151b;border:1px solid var(--line)}
.op-logo img{display:block;width:100%;height:100%;object-fit:contain}
.is-lg .op-logo{width:calc(var(--u)*24*var(--fit,1));height:calc(var(--u)*8.6*var(--fit,1));padding:calc(var(--u)*1.5) calc(var(--u)*2.2)}

.is-md .op-logo{width:calc(var(--u)*19*var(--fit,1));height:calc(var(--u)*7*var(--fit,1));padding:calc(var(--u)*1.2) calc(var(--u)*1.8)}
.is-sm .op-logo{width:calc(var(--u)*13.2*var(--fit,1));height:calc(var(--u)*6*var(--fit,1));padding:calc(var(--u)*1) calc(var(--u)*1.3)}

/* organizers */
.op-org{justify-content:center}
.op-org-row{display:flex;align-items:center;justify-content:center;gap:calc(var(--u)*7)}
.op-org-side{display:flex;flex-direction:column;align-items:center;gap:calc(var(--u)*1.6)}
.op-org-tbc{height:calc(var(--u)*12*var(--fit,1));width:auto}
.op-org-claim{margin:0;font-weight:800;font-size:calc(var(--u)*2);letter-spacing:.06em;text-transform:uppercase;background:linear-gradient(100deg,var(--a),var(--b) 55%,var(--c));-webkit-background-clip:text;background-clip:text;color:transparent}
.op-org-claim b{-webkit-text-fill-color:rgba(245,243,247,.4)}
.op-org-divider{width:2px;align-self:stretch;min-height:calc(var(--u)*24);background:linear-gradient(var(--a),var(--b),var(--c))}
.op-org-cap{margin:0;font-size:calc(var(--u)*1.7);color:var(--mute)}
.op-org-dad{width:calc(var(--u)*34*var(--fit,1));height:auto}
.op-org-day{margin:0;font-weight:800;font-size:calc(var(--u)*2);color:var(--b)}
`;
