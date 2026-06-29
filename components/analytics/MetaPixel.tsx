"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const META_PIXEL_ID = "2626290637773063";
const CONSENT_CHECK_MS = 1000;
const MARKETING_COOKIE_NAMES = [
  "advertisement",
  "advertising",
  "marketing",
  "ad_storage",
] as const;
const COOKIEYES_EVENTS = [
  "cookieyes_consent_update",
  "cookieyes_banner_load",
  "cky_consent_update",
] as const;

type ConsentValue = string | boolean | number | null | undefined;
type ConsentRecord = Record<string, unknown>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
    getCkyConsent?: () => unknown;
  }
}

function isGranted(value: ConsentValue) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  if (typeof value === "string") {
    return ["yes", "true", "1", "granted", "accepted"].includes(
      value.toLowerCase(),
    );
  }

  return false;
}

function readCookie(name: string) {
  const cookie = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${name}=`));

  return cookie
    ? decodeURIComponent(cookie.split("=").slice(1).join("="))
    : null;
}

function readConsentRecord(value: unknown): ConsentRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as ConsentRecord;
}

function hasMarketingConsentFromApi() {
  const consent = window.getCkyConsent?.();
  const record = readConsentRecord(consent);

  if (!record) {
    return false;
  }

  const categories = readConsentRecord(record.categories);
  if (categories) {
    for (const key of MARKETING_COOKIE_NAMES) {
      if (isGranted(categories[key] as ConsentValue)) {
        return true;
      }
    }
  }

  const acceptedCategories = record.acceptedCategories;
  if (Array.isArray(acceptedCategories)) {
    return acceptedCategories.some(
      (category) =>
        typeof category === "string" &&
        MARKETING_COOKIE_NAMES.includes(
          category.toLowerCase() as (typeof MARKETING_COOKIE_NAMES)[number],
        ),
    );
  }

  return MARKETING_COOKIE_NAMES.some((key) =>
    isGranted(record[key] as ConsentValue),
  );
}

function hasMarketingConsentFromCookies() {
  for (const key of MARKETING_COOKIE_NAMES) {
    if (isGranted(readCookie(`cookieyes-${key}`))) {
      return true;
    }
  }

  const singleCookie = readCookie("cookieyes-consent");
  if (!singleCookie) {
    return false;
  }

  return MARKETING_COOKIE_NAMES.some((key) => {
    const pattern = new RegExp(`${key}\\s*:\\s*(yes|true|1|granted)`, "i");
    return pattern.test(singleCookie);
  });
}

function hasMarketingConsent() {
  return hasMarketingConsentFromApi() || hasMarketingConsentFromCookies();
}

export function MetaPixel() {
  const [canLoadPixel, setCanLoadPixel] = useState(false);

  useEffect(() => {
    const updateConsent = () => {
      if (hasMarketingConsent()) {
        setCanLoadPixel(true);
      }
    };

    updateConsent();

    for (const eventName of COOKIEYES_EVENTS) {
      window.addEventListener(eventName, updateConsent);
    }

    const interval = window.setInterval(updateConsent, CONSENT_CHECK_MS);

    return () => {
      for (const eventName of COOKIEYES_EVENTS) {
        window.removeEventListener(eventName, updateConsent);
      }
      window.clearInterval(interval);
    };
  }, []);

  if (!canLoadPixel) {
    return null;
  }

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${META_PIXEL_ID}');
        fbq('track', 'PageView');
      `}
    </Script>
  );
}
