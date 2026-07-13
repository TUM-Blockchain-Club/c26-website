"use client";

import React from "react";
import classNames from "classnames";
import Image from "next/image";
import NextLink from "next/link";
import { Text } from "@/components/text";
import { Button } from "@/components/button";

interface WorkshopModel {
  title: string;
  url: string;
  description: string;
  backgroundImg: string;
  starttime: string; // ISO preferred
  endtime: string; // ISO preferred
  room: string;
}

type WorkshopElement = React.ElementRef<"article">;
export type WorkshopProps = React.ComponentPropsWithoutRef<"article"> &
  WorkshopModel;

export const WorkshopItem = React.forwardRef<WorkshopElement, WorkshopProps>(
  (props, ref) => {
    const {
      className,
      title,
      description,
      url,
      backgroundImg,
      room,
      starttime,
      endtime,
      ...restProps
    } = props;

    // ---------- Time formatting (Europe/Berlin) without “um” ----------
    const start = new Date(starttime);
    const end = new Date(endtime);
    const valid = !isNaN(start.getTime()) && !isNaN(end.getTime());

    const dateOnlyOpts: Intl.DateTimeFormatOptions = {
      timeZone: "Europe/Berlin",
      weekday: "long",
      month: "long",
      day: "numeric",
    };
    const timeOnlyOpts: Intl.DateTimeFormatOptions = {
      timeZone: "Europe/Berlin",
      hour: "2-digit",
      minute: "2-digit",
    };
    const keyOpts: Intl.DateTimeFormatOptions = {
      timeZone: "Europe/Berlin",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };

    const sameDay =
      valid &&
      new Intl.DateTimeFormat("en-CA", keyOpts).format(start) ===
        new Intl.DateTimeFormat("en-CA", keyOpts).format(end);

    // DST label
    const isBerlinDST = (d: Date) => {
      const y = d.getUTCFullYear();
      const lastMarch = new Date(Date.UTC(y, 3, 0));
      const lastSundayMarch = lastMarch.getUTCDate() - lastMarch.getUTCDay();
      const dstStartUTC = new Date(Date.UTC(y, 2, lastSundayMarch, 1, 0, 0));
      const lastOct = new Date(Date.UTC(y, 10, 0));
      const lastSundayOct = lastOct.getUTCDate() - lastOct.getUTCDay();
      const dstEndUTC = new Date(Date.UTC(y, 9, lastSundayOct, 1, 0, 0));
      return (
        d.getTime() >= dstStartUTC.getTime() &&
        d.getTime() < dstEndUTC.getTime()
      );
    };
    const tzLabel = valid ? (isBerlinDST(start) ? "CEST" : "CET") : "";

    const fmtDate = (d: Date) => d.toLocaleDateString(undefined, dateOnlyOpts);
    const fmtTime = (d: Date) => d.toLocaleTimeString([], timeOnlyOpts);

    const dateDisplay = valid
      ? sameDay
        ? // e.g. "Thursday, September 11 | 10:30 – 11:30 CEST"
          `${fmtDate(start)} | ${fmtTime(start)} – ${fmtTime(end)} ${tzLabel}`
        : // e.g. "Thursday, September 11 10:30 – Friday, September 12 17:15 CEST"
          `${fmtDate(start)} ${fmtTime(start)} – ${fmtDate(end)} ${fmtTime(end)} ${tzLabel}`
      : "";

    // ---------------------------------------------------------------

    return (
      <article
        ref={ref}
        className={classNames(
          className,
          "flex h-full flex-col border-[1px] border-white p-6 mt-0",
          "transition-transform duration-500 ease-in-out hover:scale-[102%]",
        )}
        {...restProps}
      >
        <div className="relative w-full overflow-hidden rounded-sm aspect-[16/9] sm:aspect-[3/1]">
          <Image
            src={backgroundImg || "/workshops/default-workshop.png"}
            alt={`${title} — workshop banner`}
            title={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1600px) 50vw, 800px"
            quality={90}
            priority={false}
          />
        </div>

        <Text textType="sub_title" className="mt-8">
          {title}
        </Text>

        {(dateDisplay || room) && (
          <Text textType="small" as="p" className="mt-2 text-gray-400">
            {[dateDisplay, room].filter(Boolean).join(" • ")}
          </Text>
        )}

        <div className="mt-4 flex-1">
          <Text className="text-gray-300 line-clamp-5" textType="small" as="p">
            {description}
          </Text>
        </div>

        <NextLink href={url}>
          <Button
            className="mt-4"
            buttonType="cta"
            aria-label={`Learn more about ${title}`}
          >
            Learn More
          </Button>
        </NextLink>
      </article>
    );
  },
);

WorkshopItem.displayName = "WorkshopItem";
