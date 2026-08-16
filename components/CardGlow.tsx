"use client";

import { useEffect } from "react";

const CARD_SELECTOR = ".card-tbc, .card-tbc-soft, .card-blue";

/**
 * A soft light that follows the pointer across any brand card (the classic
 * Linear/Vercel hover treatment). One delegated listener for the whole
 * document; the actual visual lives in a CSS ::before overlay driven by
 * the --glow-x/y/o custom properties set here. No-op on touch devices.
 */
export const CardGlow = () => {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;

    let current: HTMLElement | null = null;

    const clear = () => {
      if (current) {
        current.style.setProperty("--glow-o", "0");
        current = null;
      }
    };

    const onMove = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const card = target?.closest?.(CARD_SELECTOR) as HTMLElement | null;
      if (card !== current) {
        clear();
        current = card;
      }
      if (card) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--glow-x", `${e.clientX - rect.left}px`);
        card.style.setProperty("--glow-y", `${e.clientY - rect.top}px`);
        card.style.setProperty("--glow-o", "1");
      }
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", clear);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", clear);
    };
  }, []);

  return null;
};

export default CardGlow;
