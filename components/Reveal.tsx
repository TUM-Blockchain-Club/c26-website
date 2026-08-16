"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Wraps a section so it drifts up and fades in the first time it scrolls
 * into view (classes defined in globals.css, reduced-motion safe). Fires
 * once; already-visible content on load reveals immediately.
 */
export const Reveal = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  /** Optional stagger, in ms. */
  delay?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);

    // Safety net: if the observer is starved (exotic embeds, prerender
    // snapshots) content already inside the viewport must still appear.
    // Only in-viewport elements are force-revealed — everything below the
    // fold keeps its scroll-triggered entrance.
    const fallback = setTimeout(() => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setVisible(true);
        io.disconnect();
      }
    }, 2500);

    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "reveal-visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
};

export default Reveal;
