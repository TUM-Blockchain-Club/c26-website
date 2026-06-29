"use client";

import { Button } from "@/components/button";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

const LUMA_EVENT_ID = "evt-9GgBM7ScK61zTbb";
const LUMA_EVENT_URL = `https://luma.com/event/${LUMA_EVENT_ID}`;
const ATTRIBUTION_STORAGE_KEY = "tbc-conference-attribution-v1";
const TRACKED_UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

type AttributionParams = Partial<
  Record<(typeof TRACKED_UTM_PARAMS)[number], string>
>;

declare global {
  interface Window {
    plausible?: (eventName: string, options?: Record<string, unknown>) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

function readStoredAttribution() {
  try {
    const stored = window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!stored) {
      return {};
    }

    return JSON.parse(stored) as AttributionParams;
  } catch {
    return {};
  }
}

function writeStoredAttribution(attribution: AttributionParams) {
  try {
    window.sessionStorage.setItem(
      ATTRIBUTION_STORAGE_KEY,
      JSON.stringify(attribution),
    );
  } catch {
    // Storage can be unavailable in privacy-restricted browser contexts.
  }
}

function getCurrentAttribution() {
  const currentParams = new URLSearchParams(window.location.search);
  const storedAttribution = readStoredAttribution();
  const nextAttribution: AttributionParams = { ...storedAttribution };
  let sawCurrentUtm = false;

  for (const key of TRACKED_UTM_PARAMS) {
    const value = currentParams.get(key);
    if (value) {
      nextAttribution[key] = value;
      sawCurrentUtm = true;
    }
  }

  if (!nextAttribution.utm_source) {
    nextAttribution.utm_source = "direct";
  }

  if (sawCurrentUtm) {
    writeStoredAttribution(nextAttribution);
  }

  return nextAttribution;
}

function buildLumaUrl(attribution: AttributionParams) {
  const url = new URL(LUMA_EVENT_URL);

  for (const key of TRACKED_UTM_PARAMS) {
    const value = attribution[key];
    if (value) {
      url.searchParams.set(key, value);
    }
  }

  return url.toString();
}

export function LumaTicketButton({
  className,
  id,
  children = "Register for Event",
}: {
  className?: string;
  id: string;
  children?: ReactNode;
}) {
  const [href, setHref] = useState<string | null>(null);

  useEffect(() => {
    setHref(buildLumaUrl(getCurrentAttribution()));
  }, []);

  const trackTicketClick = () => {
    window.plausible?.("Ticket Click");
    window.fbq?.("track", "InitiateCheckout");
  };

  if (!href) {
    return (
      <Button buttonType="cta" disabled className={className}>
        {children}
      </Button>
    );
  }

  return (
    <Button buttonType="cta" asChild className={className}>
      <a
        id={id}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={trackTicketClick}
      >
        {children}
      </a>
    </Button>
  );
}
