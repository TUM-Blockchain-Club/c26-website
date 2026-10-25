"use client";

import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { getDeck, loadPdfjs } from "@/components/stage/decks";

/**
 * One page of a speaker's PDF, filling the screen as large as it fits on a
 * black ground. The document is opened once per session and kept while its
 * pages are shown; the next page is rendered ahead so a click is instant.
 */

const docs = new Map<string, Promise<PDFDocumentProxy | null>>();

export const openDeck = (sessionId: string, version: number) => {
  const key = `${sessionId}@${version}`;
  if (!docs.has(key)) {
    docs.set(
      key,
      (async () => {
        const rec = await getDeck(sessionId);
        if (!rec) return null;
        const pdfjs = await loadPdfjs();
        return pdfjs.getDocument({ data: rec.data.slice(0) }).promise;
      })(),
    );
  }
  return docs.get(key)!;
};

const renderInto = async (
  doc: PDFDocumentProxy,
  pageNo: number,
  canvas: HTMLCanvasElement,
) => {
  const page = await doc.getPage(pageNo);
  const base = page.getViewport({ scale: 1 });
  const box = canvas.parentElement!.getBoundingClientRect();
  const scale = Math.min(box.width / base.width, box.height / base.height);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const vp = page.getViewport({ scale: scale * dpr });
  const off = document.createElement("canvas");
  off.width = Math.round(vp.width);
  off.height = Math.round(vp.height);
  await page.render({ canvasContext: off.getContext("2d")!, viewport: vp })
    .promise;
  canvas.width = off.width;
  canvas.height = off.height;
  canvas.style.width = `${off.width / dpr}px`;
  canvas.style.height = `${off.height / dpr}px`;
  canvas.getContext("2d")!.drawImage(off, 0, 0);
};

export const DeckPage = ({
  sessionId,
  page,
  version,
}: {
  sessionId: string;
  page: number;
  version: number;
}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const doc = await openDeck(sessionId, version);
      if (!doc || cancelled || !ref.current) {
        if (!doc) setFailed(true);
        return;
      }
      await renderInto(doc, page, ref.current);
      // Warm the next page.
      if (page < doc.numPages) void doc.getPage(page + 1);
    })().catch(() => setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [sessionId, page, version]);

  return (
    <div className="stg-deck">
      {failed ? (
        <p className="stg-deck-error">
          The slides for this session could not be opened.
        </p>
      ) : (
        <canvas ref={ref} />
      )}
    </div>
  );
};
