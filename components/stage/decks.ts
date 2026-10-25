"use client";

/**
 * The speakers' own slides, one PDF per session, kept in this browser's
 * IndexedDB so the stage computer can show them without a network round trip.
 *
 * They are uploaded on the studio page and read by the stage screen, both on
 * the same computer. A BroadcastChannel tells an open screen when a deck is
 * added or removed, so it picks the change up without a reload.
 */

export type DeckMeta = {
  sessionId: string;
  fileName: string;
  size: number;
  pages: number;
  updatedAt: number;
};

type DeckRecord = DeckMeta & { data: ArrayBuffer };

const DB = "c26-stage";
const STORE = "decks";
const CHANNEL = "c26-stage-decks";

const open = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE, { keyPath: "sessionId" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

const run = async <T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> => {
  const db = await open();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const req = fn(tx.objectStore(STORE));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

const announce = () => {
  try {
    new BroadcastChannel(CHANNEL).postMessage("changed");
  } catch {
    // Old browser: the screen picks the change up on its next reload.
  }
};

export const listDecks = async (): Promise<DeckMeta[]> => {
  try {
    const all = await run<DeckRecord[]>("readonly", (s) => s.getAll());
    return all.map(({ data: _data, ...meta }) => meta);
  } catch {
    return [];
  }
};

export const getDeck = async (sessionId: string) => {
  try {
    return (
      (await run<DeckRecord | undefined>("readonly", (s) =>
        s.get(sessionId),
      )) ?? null
    );
  } catch {
    return null;
  }
};

export const saveDeck = async (
  sessionId: string,
  file: File,
  pages: number,
) => {
  const data = await file.arrayBuffer();
  await run("readwrite", (s) =>
    s.put({
      sessionId,
      fileName: file.name,
      size: file.size,
      pages,
      updatedAt: Date.now(),
      data,
    } satisfies DeckRecord),
  );
  announce();
};

export const removeDeck = async (sessionId: string) => {
  await run("readwrite", (s) => s.delete(sessionId));
  announce();
};

export const onDecksChanged = (fn: () => void) => {
  try {
    const ch = new BroadcastChannel(CHANNEL);
    ch.onmessage = fn;
    return () => ch.close();
  } catch {
    return () => undefined;
  }
};

/** pdf.js, loaded on demand in the browser only. */
export const loadPdfjs = async () => {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/stage/pdf.worker.min.mjs";
  return pdfjs;
};

export const countPages = async (file: File) => {
  const pdfjs = await loadPdfjs();
  const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() })
    .promise;
  const n = doc.numPages;
  void doc.destroy();
  return n;
};
