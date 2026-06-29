"use client";

import { Button } from "@/components/button";
import { useEffect, useState } from "react";

const META_PIXEL_ID = "2626290637773063";
const CONSENT_COOKIE = "tbc_conference_marketing_consent";
const CONSENT_STORAGE_KEY = "tbc-conference-marketing-consent";
const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

type ConsentChoice = "accepted" | "rejected";
type ConsentState = ConsentChoice | "unset" | "loading";
type MetaPixelQueue = unknown[][];
type MetaPixelFunction = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  loaded: boolean;
  push: MetaPixelFunction;
  queue: MetaPixelQueue;
  version: string;
};

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
    __tbcMetaPixelLoaded?: boolean;
  }
}

function getCookieValue(name: string) {
  const cookie = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.split("=").slice(1).join("=")) : "";
}

function isConsentChoice(value: string): value is ConsentChoice {
  return value === "accepted" || value === "rejected";
}

function getStoredConsent(): ConsentChoice | null {
  const cookieValue = getCookieValue(CONSENT_COOKIE);
  if (isConsentChoice(cookieValue)) {
    return cookieValue;
  }

  try {
    const storageValue = window.localStorage.getItem(CONSENT_STORAGE_KEY) ?? "";
    return isConsentChoice(storageValue) ? storageValue : null;
  } catch {
    return null;
  }
}

function getCookieDomain() {
  const hostname = window.location.hostname;

  if (
    hostname === "tum-blockchain.com" ||
    hostname.endsWith(".tum-blockchain.com")
  ) {
    return ".tum-blockchain.com";
  }

  return "";
}

function storeConsent(choice: ConsentChoice) {
  const domain = getCookieDomain();
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  const domainAttribute = domain ? `; Domain=${domain}` : "";

  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(
    choice,
  )}; Max-Age=${CONSENT_MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}${domainAttribute}`;

  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Some privacy-restricted browser contexts disable localStorage.
  }
}

function loadMetaPixel() {
  if (window.__tbcMetaPixelLoaded) {
    return;
  }

  window.__tbcMetaPixelLoaded = true;

  if (!window.fbq) {
    const fbq = ((...args: unknown[]) => {
      if (fbq.callMethod) {
        fbq.callMethod(...args);
        return;
      }

      fbq.queue.push(args);
    }) as MetaPixelFunction;

    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];

    window.fbq = fbq;
    window._fbq = fbq;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";

    const firstScript = document.getElementsByTagName("script")[0];
    firstScript.parentNode?.insertBefore(script, firstScript);
  }

  window.fbq?.("init", META_PIXEL_ID);
  window.fbq?.("track", "PageView");
}

export function MarketingConsent() {
  const [consent, setConsent] = useState<ConsentState>("loading");

  useEffect(() => {
    const storedConsent = getStoredConsent();

    if (storedConsent === "accepted") {
      loadMetaPixel();
      setConsent("accepted");
      return;
    }

    setConsent(storedConsent ?? "unset");
  }, []);

  const chooseConsent = (choice: ConsentChoice) => {
    storeConsent(choice);
    setConsent(choice);

    if (choice === "accepted") {
      loadMetaPixel();
    }
  };

  if (consent !== "unset") {
    return null;
  }

  return (
    <aside
      aria-label="Cookie consent"
      className="fixed inset-x-4 bottom-4 z-[10000] mx-auto max-w-3xl rounded-[5px] border border-white/20 bg-black/95 p-4 shadow-2xl backdrop-blur md:bottom-6 md:p-5"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl space-y-1">
          <p className="text-sm font-semibold text-white">Cookie preferences</p>
          <p className="text-xs leading-5 text-white/70 md:text-sm">
            We use necessary cookies for this site. With your consent, Meta
            Pixel helps us measure ticket interest and build advertising
            audiences.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            buttonType="secondary"
            className="border border-white/20 px-4 py-2 text-sm"
            onClick={() => chooseConsent("rejected")}
          >
            Reject
          </Button>
          <Button
            buttonType="cta"
            className="px-4 py-2 text-sm"
            onClick={() => chooseConsent("accepted")}
          >
            Accept
          </Button>
        </div>
      </div>
    </aside>
  );
}
