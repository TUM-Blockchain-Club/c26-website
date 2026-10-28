"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { StageSlot } from "@/components/stage/stageData";
import {
  countPages,
  listDecks,
  onDecksChanged,
  removeDeck,
  saveDeck,
  type DeckMeta,
} from "@/components/stage/decks";

/**
 * The studio for one stage: every talk of the room with its speakers, and a
 * place to drop the speaker's PDF. Uploaded slides are kept on this computer
 * and appear on the stage screen right away, after "On stage". A talk without
 * slides keeps the photo slide as its fallback.
 */

const DAY = (ms: number) =>
  new Date(ms + 60 * 60 * 1000).toISOString().slice(0, 10);
const DAY_LABEL: Record<string, string> = {
  "2026-10-29": "Thursday, 29 October",
  "2026-10-30": "Friday, 30 October, Digital Assets Day",
  "2026-10-31": "Saturday, 31 October",
};

const mb = (n: number) => `${(n / 1024 / 1024).toFixed(1)} MB`;

const Row = ({
  slot,
  deck,
  roomSlug,
}: {
  slot: StageSlot;
  deck?: DeckMeta;
  roomSlug: string;
}) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [over, setOver] = useState(false);

  const upload = useCallback(
    async (file?: File) => {
      if (!file) return;
      if (
        file.type !== "application/pdf" &&
        !file.name.toLowerCase().endsWith(".pdf")
      ) {
        setError(
          "Please choose a PDF. Export the slides from PowerPoint, Keynote or Google Slides as PDF.",
        );
        return;
      }
      setBusy(true);
      setError("");
      try {
        const pages = await countPages(file);
        await saveDeck(slot.id, file, pages);
      } catch {
        setError("This PDF could not be read. Try exporting it again.");
      } finally {
        setBusy(false);
      }
    },
    [slot.id],
  );

  const speakers = slot.people.filter((p) => !p.moderator);
  return (
    <li
      className={`studio-row ${over ? "is-over" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        void upload(e.dataTransfer.files[0]);
      }}
    >
      <span className="studio-time">
        {slot.timeTba ? "TBA" : slot.startLabel}
      </span>
      <div className="studio-main">
        <span className="studio-title">
          {slot.title.split(/\s+[-–—]\s+/).map((part, i) => (
            <span key={i} className="studio-tl">
              {part}
            </span>
          ))}
        </span>
        <span className="studio-people">
          {speakers.length
            ? speakers.map((p) => p.name).join(", ")
            : "No speaker confirmed yet"}
        </span>
        {slot.slides && slot.slides.length > 0 && (
          <span className="studio-strapi">
            From Strapi: {slot.slides.length}{" "}
            {slot.slides.length === 1 ? "file" : "files"}
            {deck ? " (the PDF here is shown instead)" : ""}{" "}
            <Link
              href={`/stage-76803f8f95/${roomSlug}?cue=${encodeURIComponent(`${slot.id}:deck:1`)}`}
              target="_blank"
            >
              Preview
            </Link>
          </span>
        )}
        {slot.slidesSkipped?.map((name) => (
          <span key={name} className="studio-error">
            {name} cannot be shown on the screen. Export it as a PDF and
            upload that to the session in Strapi instead.
          </span>
        ))}
        {error && <span className="studio-error">{error}</span>}
      </div>
      <div className="studio-deck">
        {deck ? (
          <>
            <span className="studio-file" title={deck.fileName}>
              <strong>{deck.pages} slides</strong> {deck.fileName}{" "}
              {mb(deck.size)}
            </span>
            <span className="studio-actions">
              <Link
                href={`/stage-76803f8f95/${roomSlug}?cue=${encodeURIComponent(`${slot.id}:deck:1`)}`}
                target="_blank"
              >
                Preview
              </Link>
              <label>
                Replace
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(e) => void upload(e.target.files?.[0])}
                />
              </label>
              <button type="button" onClick={() => void removeDeck(slot.id)}>
                Remove
              </button>
            </span>
          </>
        ) : (
          <label className="studio-upload">
            {busy ? "Reading…" : "Add PDF"}
            <input
              type="file"
              accept="application/pdf,.pdf"
              disabled={busy}
              onChange={(e) => void upload(e.target.files?.[0])}
            />
            <small>or drop it here, photo slide until then</small>
          </label>
        )}
      </div>
    </li>
  );
};

export const StageStudio = ({
  roomSlug,
  room,
  slots,
}: {
  roomSlug: string;
  room: string;
  slots: StageSlot[];
}) => {
  const [decks, setDecks] = useState<Map<string, DeckMeta>>(new Map());
  useEffect(() => {
    const load = () =>
      void listDecks().then((all) =>
        setDecks(new Map(all.map((d) => [d.sessionId, d]))),
      );
    load();
    return onDecksChanged(load);
  }, []);

  const talks = slots.filter((s) => s.kind === "talk");
  const days = [...new Set(talks.map((t) => DAY(t.start)))];
  const withDeck = talks.filter((t) => decks.has(t.id)).length;

  return (
    <div className="studio">
      <style>{CSS}</style>
      <header className="studio-head">
        <div>
          <p className="studio-eyebrow">Stage studio</p>
          <h1>{room}</h1>
          <p className="studio-sub">
            {withDeck} of {talks.length} talks have slides. Slides are kept on
            this computer and show on the stage screen after “On stage”. Talks
            without slides keep the photo slide.
          </p>
        </div>
        <Link
          className="studio-open"
          href={`/stage-76803f8f95/${roomSlug}`}
          target="_blank"
        >
          Open stage screen ↗
        </Link>
      </header>
      {days.map((day) => (
        <section key={day}>
          <h2>{DAY_LABEL[day] ?? day}</h2>
          <ul>
            {talks
              .filter((t) => DAY(t.start) === day)
              .map((t) => (
                <Row
                  key={t.id}
                  slot={t}
                  deck={decks.get(t.id)}
                  roomSlug={roomSlug}
                />
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
};

const CSS = `
.studio{position:fixed;inset:0;z-index:20000;overflow:auto;background:#08070c;color:#fff;font-size:15px;line-height:1.5;font-family:inherit;padding:40px max(24px,env(safe-area-inset-right)) 80px max(24px,env(safe-area-inset-left))}
.studio-head{max-width:1100px;margin:0 auto 32px;display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap}
.studio-eyebrow{margin:0;font-weight:700;letter-spacing:.2em;text-transform:uppercase;font-size:14px;color:#ffc110}
.studio h1{margin:4px 0 8px;font-size:34px}
.studio-sub{margin:0;color:rgba(255,255,255,.65);max-width:640px}
.studio-open{color:#fff;border:1px solid rgba(255,255,255,.25);border-radius:10px;padding:10px 14px;text-decoration:none;font-weight:600}
.studio section{max-width:1100px;margin:0 auto 28px}
.studio h2{font-size:14px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.55);margin:0 0 10px}
.studio ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.studio-row{display:grid;grid-template-columns:64px minmax(0,1fr) minmax(0,340px);gap:16px;align-items:center;padding:14px 16px;border:1px solid rgba(255,255,255,.1);border-radius:12px;background:rgba(255,255,255,.03)}
.studio-row.is-over{border-color:#ffc110;background:rgba(255,193,16,.08)}
.studio-time{font-weight:700;font-variant-numeric:tabular-nums}
.studio-main{display:flex;flex-direction:column;min-width:0}
.studio-title{font-weight:600}
.studio-tl+.studio-tl{margin-left:.8em;opacity:.75}
.studio-people,.studio-file{color:rgba(255,255,255,.6);font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.studio-file strong{color:#fff}
.studio-error{color:#ff8f86;font-size:14px}
.studio-strapi{font-size:14px;color:rgba(255,255,255,.8)}
.studio-note{font-size:14px;color:#ffd27a}
.studio-strapi a{color:inherit;text-decoration:underline;margin-left:6px}
.studio-deck{display:flex;flex-direction:column;gap:6px;min-width:0}
.studio-actions{display:flex;gap:8px;flex-wrap:wrap}
.studio-actions a,.studio-actions label,.studio-actions button,.studio-upload{cursor:pointer;color:#fff;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.18);border-radius:8px;padding:6px 10px;font-family:inherit;font-size:14px;font-weight:600;line-height:1.2;text-decoration:none}
.studio-upload{display:flex;flex-direction:column;gap:2px;text-align:center;border-style:dashed}
.studio-upload small{font-weight:400;color:rgba(255,255,255,.5)}
.studio input[type=file]{display:none}
@media (max-width:760px){.studio-row{grid-template-columns:52px minmax(0,1fr)}.studio-deck{grid-column:1/-1}}
`;
