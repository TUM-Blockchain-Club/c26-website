"use client";

import { CheckIcon, Link2Icon, Share1Icon } from "@radix-ui/react-icons";
import classNames from "classnames";
import { useEffect, useState } from "react";
import type { AgendaTalk } from "@/constants/digitalAssetsDayAgenda";
import { buildSessionShareLink } from "@/util/utmLink";
import { dayLabel, peopleOf } from "@/components/agenda/sessionMeta";

/**
 * Sharing for one session. Phones get their own share sheet, which reaches
 * WhatsApp, LinkedIn, Instagram and the rest; everyone also gets a copyable
 * link. Every link is the session's own page, which carries a preview image
 * with the speakers, title and time.
 */
type Medium = "native" | "copy";

const track = (session: string, method: Medium) =>
  window.plausible?.("Session Share", { props: { session, method } });

/** "Title" with Name and Name, Thursday, October 29 at 09:20 */
const shareText = (talk: AgendaTalk) => {
  const names = peopleOf(talk).map((p) => p.name);
  const who =
    names.length > 1
      ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`
      : names[0];
  const what = talk.title ? `“${talk.title}”` : `A session`;
  return `${what}${who ? ` with ${who}` : ""}, ${dayLabel(talk.day)} at ${
    talk.time
  }, TUM Blockchain Conference 26`;
};

const BUTTON =
  "flex h-10 items-center justify-center gap-2 rounded-lg border border-line px-3 text-sm font-bold text-white transition-colors hover:border-line-strong hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus";

export const SessionShare = ({ talk }: { talk: AgendaTalk }) => {
  // Only known after mounting: the server cannot tell, and guessing would
  // render a button the browser then has to take away again.
  const [canShare, setCanShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator.share === "function");
  }, []);

  const text = shareText(talk);

  const nativeShare = async () => {
    try {
      await navigator.share({
        title: talk.title ?? "TUM Blockchain Conference 26",
        text,
        url: buildSessionShareLink(talk.id, "native"),
      });
      track(talk.id, "native");
    } catch {
      // Dismissing the share sheet rejects too; nothing to do either way.
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        buildSessionShareLink(talk.id, "copy"),
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      track(talk.id, "copy");
    } catch {
      // Clipboard API can be unavailable (insecure context, permissions).
    }
  };

  return (
    <div className="flex items-center gap-2">
      {canShare && (
        <button
          type="button"
          onClick={nativeShare}
          className={classNames(
            BUTTON,
            "btn-gradient-tbc flex-1 sm:flex-none sm:px-5",
          )}
        >
          <Share1Icon className="h-4 w-4" />
          Share
        </button>
      )}
      <button
        type="button"
        onClick={copyLink}
        className={classNames(
          BUTTON,
          "flex-1 sm:flex-none sm:px-5",
          !canShare && "btn-gradient-tbc",
        )}
        aria-label="Copy link to this session"
      >
        {copied ? (
          <CheckIcon className="h-4 w-4" />
        ) : (
          <Link2Icon className="h-4 w-4" />
        )}
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
};

export default SessionShare;
