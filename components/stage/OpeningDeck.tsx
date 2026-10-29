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

/* Every claim on these slides has a source (see docs/stage-screens.md):
   2023: BTC-ECHO (8 Sep 2023) and the Qwoted event listing, Deutsches
   Museum, 22 to 23 September, over 50 talks, panels and workshops.
   2024: the Luma event page, Deutsches Museum, 12 to 13 September.
   2025: this site (sections/Statistic.tsx, Venue.tsx), House of
   Communication, 1,200+ attendees, 125+ speakers, 18 sponsors; the 2025
   manifesto calls it the 3rd iteration, so 2023 was the 1st.
   2026: counted live from Strapi. */
type Fact = { value: string; label: string };
type Year = {
  id: OpeningSlideId;
  year: string;
  edition: string;
  venue: string;
  when?: string;
  facts: Fact[];
  photo?: string;
};

const YEARS: Year[] = [
  {
    id: "y2023",
    year: "2023",
    edition: "1st edition",
    venue: "Deutsches Museum",
    when: "22 to 23 September",
    facts: [{ value: "50+", label: "Talks, panels and workshops" }],
    photo: `${IMG}/year-2023.jpg`,
  },
  {
    id: "y2024",
    year: "2024",
    edition: "2nd edition",
    venue: "Deutsches Museum",
    when: "12 to 13 September",
    facts: [],
    photo: `${IMG}/year-2024.jpg`,
  },
  {
    id: "y2025",
    year: "2025",
    edition: "3rd edition",
    venue: "House of Communication",
    facts: [
      { value: "1,200+", label: "Attendees" },
      { value: "125+", label: "Speakers" },
      { value: "18", label: "Sponsors" },
    ],
    photo: `${IMG}/year-2025.jpg`,
  },
  {
    id: "y2026",
    year: "2026",
    edition: "4th edition",
    venue: "House of Communication",
    when: "29 to 31 October",
    facts: [],
  },
];

export type OpeningFacts = {
  sessions: number;
  speakers: number;
  sponsors: number;
};

const factsOf = (y: Year, live?: OpeningFacts): Fact[] =>
  y.id === "y2026" && live
    ? [
        { value: "3", label: "Days" },
        { value: String(live.sessions), label: "Sessions" },
        { value: String(live.speakers), label: "Speakers" },
        { value: String(live.sponsors), label: "Sponsors" },
      ]
    : y.facts;

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="stg-label op-rise" style={d(0.1)}>
    <i aria-hidden />
    {children}
  </span>
);

/** The brand mark: sticker and wordmark. */
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
    <ol className="op-years">
      <span className="op-years-line op-draw" style={d(0.3)} aria-hidden />
      {YEARS.map((y, i) => (
        <li key={y.year} className={y.photo ? undefined : "is-now"}>
          <span className="op-years-dot op-pop" style={d(0.45 + i * 0.2)} />
          <span className="op-years-year op-rise" style={d(0.5 + i * 0.2)}>
            {y.year}
          </span>
          <span className="op-years-venue op-rise" style={d(0.6 + i * 0.2)}>
            {y.venue}
          </span>
          <span className="op-years-edition op-rise" style={d(0.65 + i * 0.2)}>
            {y.edition}
          </span>
          <div className="op-years-media op-rise" style={d(0.75 + i * 0.2)}>
            {y.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={y.photo} alt="" />
            ) : (
              <Brand delay={1.5} />
            )}
          </div>
        </li>
      ))}
    </ol>
  </section>
);

const YearSlide = ({ y, live }: { y: Year; live?: OpeningFacts }) => {
  const facts = factsOf(y, live);
  return (
    <section className="stg-scene op op-year">
      <div className="op-year-text">
        <Label>Our story</Label>
        <span className="op-year-edition op-rise" style={d(0.25)}>
          {y.edition}
        </span>
        <span className="op-year-num op-rise" style={d(0.35)}>
          {y.year}
        </span>
        <h1 className="op-year-venue op-rise" style={d(0.5)}>
          {y.venue}
        </h1>
        {y.when && (
          <p className="op-year-when op-rise" style={d(0.6)}>
            {y.when}
          </p>
        )}
        {facts.length > 0 && (
          <dl className="op-year-facts">
            {facts.map((f, i) => (
              <div key={f.label} className="op-rise" style={d(0.75 + i * 0.1)}>
                <dt>{f.value}</dt>
                <dd>{f.label}</dd>
              </div>
            ))}
          </dl>
        )}
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
};

/* Why: the website's own words (constants/mediaPortal.ts, Manifesto). */
const Why = () => (
  <section className="stg-scene op op-why">
    <Label>Why we do this</Label>
    <p className="op-statement op-rise" style={d(0.35)}>
      Built for the entire blockchain ecosystem: curious newcomers, students,
      builders, researchers, founders, policymakers and industry leaders.
    </p>
    <ul className="op-pillars">
      {(
        [
          [
            "Run by students",
            "Organised by the student-run TUM Blockchain Club",
          ],
          ["Non-profit", "A non-profit setting for open dialogue"],
          [
            "Open to everyone",
            "No need to be a student or an expert to attend",
          ],
        ] as const
      ).map(([title, line], i) => (
        <li key={title} className="op-rise" style={d(0.8 + i * 0.15)}>
          <span className="op-pillar-rule op-draw" style={d(0.8 + i * 0.15)} />
          <strong>{title}</strong>
          <span>{line}</span>
        </li>
      ))}
    </ul>
  </section>
);

/* Goals: as the organisers put them in the "C26 Opening" deck. */
const Goals = () => (
  <section className="stg-scene op op-goals">
    <Label>What we want to achieve</Label>
    <ol className="op-goal-list">
      {[
        "Connect students with the industry",
        "Bring Europe’s institutions to the table",
        "Turn ideas into code",
        "Make Munich a home for Web3",
      ].map((text, i) => (
        <li key={text} className="op-rise" style={d(0.4 + i * 0.15)}>
          <span className="op-goal-rule op-draw" style={d(0.4 + i * 0.15)} />
          <span className="op-goal-no">0{i + 1}</span>
          <span className="op-goal-text">{text}</span>
        </li>
      ))}
    </ol>
  </section>
);

/* Agenda: dates from the site; the Hackathon's 32 hours from the media
   portal, its 09:00 Friday start from hackathon.tum-blockchain.com. */
const Agenda = () => (
  <section className="stg-scene op op-agenda">
    <Label>Three days</Label>
    <div className="op-days">
      {(
        [
          ["Thursday", "29"],
          ["Friday", "30"],
          ["Saturday", "31"],
        ] as const
      ).map(([day, date], i) => (
        <div
          key={date}
          className="op-day-head op-rise"
          style={d(0.35 + i * 0.12)}
        >
          <span className="op-day-num">{date}</span>
          <span className="op-day-name">
            {day}
            <br />
            October
          </span>
        </div>
      ))}
      <div className="op-day-event op-rise" style={d(0.8)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logos/c26-wordmark-no-hackathon.svg"
          alt="TUM Blockchain Conference 26"
          className="op-day-c26"
        />
        <span>Conference day</span>
      </div>
      <div className="op-day-event op-rise" style={d(0.95)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logos/digital-assets-day-logo.png"
          alt="Digital Assets Day by Bundesblock"
          className="op-day-dad"
        />
        <span>Curated by Bundesblock</span>
      </div>
      <span />
      <div className="op-hack op-wipe" style={d(1.2)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${IMG}/hackathon-script.png`}
          alt="Hackathon"
          className="op-hack-script"
        />
        <span className="op-hack-text">
          <strong>32 hours</strong>
          <span>Starts Friday at 09:00</span>
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
  rooms,
  delay,
}: {
  title: string;
  src: string;
  ratio: string;
  pins: Pin[];
  rooms: [number, string, string][];
  delay: number;
}) => (
  <figure className="op-plan op-rise" style={d(delay)}>
    <figcaption>{title}</figcaption>
    <div className="op-plan-box">
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
    </div>
    <ul className="op-rooms">
      {rooms.map(([n, name, where]) => (
        <li key={n}>
          <b>{n}</b>
          <strong>{name}</strong>
          <span>{where}</span>
        </li>
      ))}
    </ul>
  </figure>
);

/* Stages: rooms as the floor plans label them; Friday's names from the
   agenda (constants/digitalAssetsDayAgenda.ts). */
const Stages = () => (
  <section className="stg-scene op op-stages">
    <Label>Stages</Label>
    <div className="op-plans">
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
        rooms={[
          [1, "Nakamoto", "LAB Lounge | Main Stage on Friday"],
          [3, "Hopper", "Worklab 2 | Future Stage on Friday"],
          [4, "GERN", "Entrance, expo and hackathon"],
        ]}
      />
      <Plan
        title="First floor, up the stairs"
        src={`${IMG}/plan-first.png`}
        ratio="440 / 446"
        delay={0.5}
        pins={[{ n: 2, name: "Turing", x: 50.5, y: 83.8 }]}
        rooms={[[2, "Turing", "Konferenz 9+10 | Executive Forum on Friday"]]}
      />
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
  facts,
}: {
  id: OpeningSlideId;
  sponsors: StageSponsor[];
  facts?: OpeningFacts;
}) => {
  const year = YEARS.find((y) => y.id === id);
  if (year) return <YearSlide y={year} live={facts} />;
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

/* our story: a line through the years, photos underneath */
.op-years{position:relative;flex:1;min-height:0;list-style:none;margin:calc(var(--u)*1) 0 0;padding:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:calc(var(--u)*3)}
.op-years-line{position:absolute;left:0;right:0;top:calc(var(--u)*.55);height:1px;background:linear-gradient(90deg,var(--a),var(--b) 60%,var(--c))}
.op-years li{position:relative;display:flex;flex-direction:column;min-width:0;padding-top:calc(var(--u)*2.2)}
.op-years-dot{position:absolute;left:0;top:0;width:calc(var(--u)*1.1);height:calc(var(--u)*1.1);border-radius:50%;background:var(--ink)}
.op-years .is-now .op-years-dot{background:var(--b);box-shadow:0 0 0 calc(var(--u)*.4) rgba(244,67,54,.22)}
.op-years-year{font-weight:800;font-size:calc(var(--u)*4.2);line-height:1;letter-spacing:-.03em;padding-bottom:.08em}
.op-years .is-now .op-years-year{background:linear-gradient(100deg,var(--a),var(--b) 55%,var(--c));-webkit-background-clip:text;background-clip:text;color:transparent}
.op-years-venue{margin-top:calc(var(--u)*.6);font-weight:700;font-size:calc(var(--u)*1.7)}
.op-years-edition{margin-top:calc(var(--u)*.2);font-size:calc(var(--u)*1.25);color:var(--mute)}
.op-years-media{flex:1;min-height:0;position:relative;margin-top:calc(var(--u)*1.6);border-radius:calc(var(--u)*.6);overflow:hidden;background:#111016}
.op-years-media > img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.op-years-media .op-brand{position:absolute;inset:0;gap:calc(var(--u)*1.2)}
.op-years-media .op-sticker{height:42%}
.op-years-media .op-wordmark{height:48%}

/* one year */
.op-year{flex-direction:row;gap:calc(var(--u)*5)}
.op-year-text{flex:0 0 auto;width:calc(var(--u)*50);display:flex;flex-direction:column;justify-content:center;min-width:0}
.op-year-edition{margin-top:calc(var(--u)*1.4);font-weight:700;font-size:calc(var(--u)*1.4);color:var(--acc)}
.op-year-num{font-weight:800;font-size:calc(var(--u)*9*var(--fit,1));line-height:1;letter-spacing:-.04em;padding-bottom:.08em;background:linear-gradient(100deg,var(--a),var(--b) 55%,var(--c));-webkit-background-clip:text;background-clip:text;color:transparent}
.op-year-venue{margin:calc(var(--u)*.6) 0 0;font-weight:800;font-size:calc(var(--u)*3.4*var(--fit,1));line-height:1.1;letter-spacing:-.02em;padding-bottom:.08em}
.op-year-when{margin:calc(var(--u)*.6) 0 0;font-size:calc(var(--u)*1.7);color:var(--mute)}
.op-year-facts{margin:calc(var(--u)*2.6) 0 0;display:flex;gap:calc(var(--u)*3.2);flex-wrap:wrap}
.op-year-facts div{display:flex;flex-direction:column;gap:calc(var(--u)*.3);padding-top:calc(var(--u)*.9);border-top:1px solid var(--line);min-width:calc(var(--u)*8)}
.op-year-facts dt{font-weight:800;font-size:calc(var(--u)*3);line-height:1;letter-spacing:-.02em}
.op-year-facts dd{margin:0;font-size:calc(var(--u)*1.25);color:var(--mute)}
.op-year-media{flex:1;min-width:0;position:relative;overflow:hidden;border-radius:calc(var(--u)*.8);animation:op-pop 1.2s var(--ease) .2s both}
.op-year-media > img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.op-kenburns{animation:op-kenburns 14s cubic-bezier(.2,.6,.2,1) both}
.op-year-media.is-brand{background:radial-gradient(120% 120% at 80% 0%,rgba(111,61,226,.3),transparent 60%),radial-gradient(100% 100% at 0% 100%,rgba(244,67,54,.22),transparent 60%),#100f14}
.op-year-media.is-brand .op-brand{position:absolute;inset:0}

/* why */
.op-why{justify-content:center}
.op-statement{margin:calc(var(--u)*.6) 0 0;font-weight:800;font-size:calc(var(--u)*4*var(--fit,1));line-height:1.15;letter-spacing:-.02em;max-width:calc(var(--u)*105);text-wrap:balance}
.op-pillars{list-style:none;margin:calc(var(--u)*4) 0 0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:calc(var(--u)*4);max-width:calc(var(--u)*130)}
.op-pillars li{position:relative;display:flex;flex-direction:column;gap:calc(var(--u)*.5);padding-top:calc(var(--u)*1.2)}
.op-pillar-rule,.op-goal-rule{position:absolute;left:0;right:0;top:0;height:2px;background:linear-gradient(90deg,var(--a),var(--b),var(--c))}
.op-pillars strong{font-size:calc(var(--u)*2.2);font-weight:800}
.op-pillars span:not(.op-pillar-rule){font-size:calc(var(--u)*1.4);color:var(--mute)}

/* goals */
.op-goals{justify-content:center}
.op-goal-list{list-style:none;margin:calc(var(--u)*2) 0 0;padding:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:calc(var(--u)*3.4)}
.op-goal-list li{position:relative;display:flex;flex-direction:column;gap:calc(var(--u)*1.2);padding-top:calc(var(--u)*1.4)}
.op-goal-no{font-weight:800;font-size:calc(var(--u)*5);line-height:1;letter-spacing:-.03em;background:linear-gradient(100deg,var(--a),var(--b) 55%,var(--c));-webkit-background-clip:text;background-clip:text;color:transparent;padding-bottom:.06em}
.op-goal-text{font-weight:800;font-size:calc(var(--u)*2.4);line-height:1.2;text-wrap:balance}

/* agenda */
.op-agenda{justify-content:center}
.op-days{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));column-gap:calc(var(--u)*4);row-gap:calc(var(--u)*2.2);margin-top:calc(var(--u)*1)}
.op-day-head{display:flex;align-items:flex-end;gap:calc(var(--u)*1.2);padding-bottom:calc(var(--u)*1.2);border-bottom:1px solid var(--line)}
.op-day-num{font-weight:800;font-size:calc(var(--u)*7);line-height:.9;letter-spacing:-.04em}
.op-day-name{font-weight:600;font-size:calc(var(--u)*1.4);line-height:1.25;color:var(--mute);padding-bottom:calc(var(--u)*.4)}
.op-day-event{display:flex;flex-direction:column;align-items:flex-start;gap:calc(var(--u)*1);min-width:0}
.op-day-event span{font-size:calc(var(--u)*1.4);color:var(--mute)}
.op-day-c26{height:calc(var(--u)*8);width:auto}
.op-day-dad{width:min(100%,calc(var(--u)*30));height:auto}
.op-hack{grid-column:2 / span 2;display:flex;align-items:center;gap:calc(var(--u)*3);padding:calc(var(--u)*1.4) calc(var(--u)*2.4);border-radius:calc(var(--u)*.8);background:linear-gradient(100deg,rgba(255,193,16,.12),rgba(244,67,54,.12) 50%,rgba(111,61,226,.16));border:1px solid rgba(244,67,54,.35)}
.op-hack-script{height:calc(var(--u)*3.8);width:auto}
.op-hack-text{display:flex;flex-direction:column;gap:calc(var(--u)*.3)}
.op-hack-text strong{font-size:calc(var(--u)*2.2);font-weight:800}
.op-hack-text span{font-size:calc(var(--u)*1.4);color:var(--mute)}

/* stages: two floors, equal in size */
.op-plans{flex:1;min-height:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:calc(var(--u)*4)}
.op-plan{margin:0;display:flex;flex-direction:column;gap:calc(var(--u)*1);min-width:0;min-height:0}
.op-plan figcaption{font-weight:700;font-size:calc(var(--u)*1.4);color:var(--mute)}
.op-plan-box{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;border-radius:calc(var(--u)*.8);background:rgba(255,255,255,.035);padding:calc(var(--u)*1.2)}
.op-plan-img{position:relative;height:100%;max-width:100%}
.op-plan-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;opacity:.92}
.op-pin{position:absolute;display:flex;align-items:center;gap:calc(var(--u)*.5);transform:translate(calc(var(--u)*-1.1),-50%);animation:op-pop .8s var(--ease) both;animation-delay:var(--d,0s)}
.op-pin.is-left{flex-direction:row-reverse;transform:translate(calc(-100% + var(--u)*1.1),-50%)}
.op-pin b{position:relative;z-index:1;width:calc(var(--u)*2.2);height:calc(var(--u)*2.2);border-radius:50%;display:grid;place-items:center;font-size:calc(var(--u)*1.1);font-weight:800;color:#fff;background:var(--b)}
.op-halo{position:absolute;left:calc(var(--u)*1.1);top:50%;width:calc(var(--u)*4.4);height:calc(var(--u)*4.4);border-radius:50%;background:radial-gradient(circle,rgba(244,67,54,.45),rgba(244,67,54,0) 70%);animation:op-halo 2.8s ease-out infinite}
.op-pin.is-left .op-halo{left:auto;right:calc(var(--u)*-1.1)}
.op-pin em{font-style:normal;font-weight:800;font-size:calc(var(--u)*1.15);padding:calc(var(--u)*.2) calc(var(--u)*.6);border-radius:calc(var(--u)*.3);background:rgba(10,9,12,.85);white-space:nowrap}
.op-rooms{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:calc(var(--u)*.6) calc(var(--u)*2.6)}
.op-rooms li{display:flex;align-items:baseline;gap:calc(var(--u)*.7);font-size:calc(var(--u)*1.25);color:var(--mute)}
.op-rooms b{align-self:center;width:calc(var(--u)*1.8);height:calc(var(--u)*1.8);border-radius:50%;display:grid;place-items:center;font-size:calc(var(--u)*.95);font-weight:800;color:#fff;background:var(--b)}
.op-rooms strong{font-size:calc(var(--u)*1.5);font-weight:800;color:var(--ink)}

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
