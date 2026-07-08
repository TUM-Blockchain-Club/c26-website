"use client";

import { Text } from "@/components/text";
import classNames from "classnames";
import Image from "next/image";
import React from "react";
import { Speaker as SpeakerModel } from "@/components/service/contentStrapi";
import Link from "next/link";
import {
  GitHubLogoIcon,
  GlobeIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";

type SpeakerProps = Omit<React.HTMLAttributes<HTMLDivElement>, "id"> &
  SpeakerModel;

export const Speaker = React.forwardRef<HTMLDivElement, SpeakerProps>(
  (
    {
      name,
      position,
      company_name,
      profile_photo,
      url,
      priority,
      createdAt,
      documentId,
      updatedAt,
      publishedAt,
      className,
      ...rest
    },
    ref,
  ) => {
    const urlType = (() => {
      if (url?.includes("x.com") || url?.includes("twitter.com")) return "x";
      if (url?.includes("linkedin.com")) return "linkedin";
      if (url?.includes("github.com")) return "github";
      return "website";
    })();

    return (
      <div
        className={classNames(
          className,
          "group flex w-full max-w-[220px] flex-col gap-4 items-start",
        )}
        ref={ref}
        {...{ ...rest, id: undefined }} // Exclude the `id` property
      >
        <div
          className={
            "w-full rounded-full bg-gradient-tbc p-[3px] transition-transform duration-300 group-hover:scale-105"
          }
        >
          <Image
            className={
              "speaker-photo w-full h-auto aspect-square object-cover rounded-full transition-all duration-300"
            }
            src={profile_photo?.url || "/speakers/placeholder.webp"}
            alt={name}
            title={name}
            width={275}
            height={275}
          />
        </div>
        <div className={"flex flex-col gap-1 self-stretch"}>
          <Text
            textType={"sub_title"}
            className={"font-bold break-words hyphens-auto"}
          >
            {name}
          </Text>
          <Text textType={"paragraph"}>
            {position}, {company_name}
          </Text>
          {url && (
            <div className={"w-fit"}>
              <Link href={url} className={"text-inherit"}>
                {urlType === "x" && <TwitterLogoIcon />}
                {urlType === "website" && <GlobeIcon />}
                {urlType === "linkedin" && <LinkedInLogoIcon />}
                {urlType === "github" && <GitHubLogoIcon />}
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  },
);
Speaker.displayName = "Speaker";
