"use client";

import { useEffect, useState } from "react";
import { rgbTripletToCss, rgbTripletToHex } from "@/util/color";

export type ResolvedColor = {
  triplet: string;
  alpha: number;
  hex: string;
  rgbCss: string;
  ready: boolean;
};

const EMPTY: ResolvedColor = {
  triplet: "",
  alpha: 1,
  hex: "",
  rgbCss: "",
  ready: false,
};

/**
 * Reads a color token straight off :root at render time — this is what
 * keeps the brand guide from ever holding a hardcoded copy of a color.
 */
export function useCssToken(cssVar: string, alphaVar?: string): ResolvedColor {
  const [value, setValue] = useState<ResolvedColor>(EMPTY);

  useEffect(() => {
    const style = getComputedStyle(document.documentElement);
    const triplet = style.getPropertyValue(cssVar).trim();
    const alpha = alphaVar
      ? parseFloat(style.getPropertyValue(alphaVar).trim() || "1")
      : 1;

    if (!triplet) {
      setValue(EMPTY);
      return;
    }

    setValue({
      triplet,
      alpha,
      hex: rgbTripletToHex(triplet),
      rgbCss: rgbTripletToCss(triplet, alphaVar ? alpha : undefined),
      ready: true,
    });
  }, [cssVar, alphaVar]);

  return value;
}

/** Reads a plain (non-color) CSS custom property, e.g. a radius or spacing value. */
export function useCssRawToken(cssVar: string): string {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(
      getComputedStyle(document.documentElement)
        .getPropertyValue(cssVar)
        .trim(),
    );
  }, [cssVar]);

  return value;
}
