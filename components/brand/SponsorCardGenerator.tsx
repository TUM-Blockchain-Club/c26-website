"use client";

import { useEffect, useState } from "react";
import { Text } from "@/components/text";
import { Button } from "@/components/button";
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";
import { downloadBlob } from "@/util/exportLogo";
import {
  renderSponsorCardVideo,
  renderSponsorCardStill,
  SPONSOR_TIERS,
  TIER_LOGO_COUNT,
  TIER_LABEL,
  type SponsorTier,
  type CardOrientation,
} from "@/util/partnerCardVideo";

type Status = "idle" | "generating" | "ready" | "error";
type LogoEntry = { file: File; url: string };

const MAX_LOGO_SIZE = 8 * 1024 * 1024;

const TIER_SWATCH: Record<SponsorTier, string> = {
  platinum: "linear-gradient(135deg, #ffffff, #96b9ff)",
  gold: "linear-gradient(135deg, #ffe096, #a36e19)",
  silver: "linear-gradient(135deg, #ebeff3, #788696)",
  bronze: "linear-gradient(135deg, #e4aa78, #7a4828)",
};

export const SponsorCardGenerator = () => {
  const [tier, setTier] = useState<SponsorTier>("platinum");
  const [logos, setLogos] = useState<LogoEntry[]>([]);
  const [orientation, setOrientation] = useState<CardOrientation>("landscape");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoExt, setVideoExt] = useState<"mp4" | "webm">("webm");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const requiredCount = TIER_LOGO_COUNT[tier];
  const hasLogos = logos.length > 0;
  const ready = logos.length === requiredCount;
  const activeStep = !ready ? 2 : 3;

  const clearOutput = () => {
    setVideoUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setVideoBlob(null);
    setStatus("idle");
    setProgress(0);
  };

  useEffect(() => {
    setVideoUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setVideoBlob(null);
    setStatus("idle");
    setProgress(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tier, logos, orientation]);

  // Each tier has its own exact logo count — switching tiers starts the
  // upload over so the count can never end up mismatched.
  const handleTierChange = (next: SponsorTier) => {
    if (next === tier) return;
    setTier(next);
    setLogos((prev) => {
      prev.forEach((l) => URL.revokeObjectURL(l.url));
      return [];
    });
    setErrorMsg(null);
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!selected.length) return;

    clearOutput();
    setErrorMsg(null);

    const room = requiredCount - logos.length;
    const oversized = selected.some((f) => f.size > MAX_LOGO_SIZE);
    if (oversized) {
      setErrorMsg("One of those files is larger than 8MB. Use a smaller logo.");
      return;
    }

    const accepted = selected.slice(0, room);
    if (selected.length > room) {
      const tierLabel = tier[0].toUpperCase() + tier.slice(1);
      setErrorMsg(
        `${tierLabel} posts need exactly ${requiredCount} logo${requiredCount === 1 ? "" : "s"} — only added ${accepted.length} more.`,
      );
    }

    const entries = accepted.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setLogos((prev) => [...prev, ...entries]);
  };

  const removeLogo = (index: number) => {
    clearOutput();
    setLogos((prev) => {
      const next = [...prev];
      const [removed] = next.splice(index, 1);
      if (removed) URL.revokeObjectURL(removed.url);
      return next;
    });
  };

  const handleGenerate = async () => {
    if (!ready) return;
    setStatus("generating");
    setProgress(0);
    setErrorMsg(null);

    const content = { tier, logoUrls: logos.map((l) => l.url) };

    try {
      const { blob, extension } = await renderSponsorCardVideo(
        content,
        orientation,
        setProgress,
      );
      setVideoBlob(blob);
      setVideoExt(extension);
      setVideoUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
      setStatus("ready");
    } catch (err) {
      console.error("Video generation failed:", err);
      setErrorMsg(
        "Your browser could not record the video. Please try again in a recent Chrome, Edge or Firefox.",
      );
      setStatus("error");
    }
  };

  const handleDownloadVideo = () => {
    if (!videoBlob) return;
    downloadBlob(
      videoBlob,
      `tbc-conference-26-${tier}-sponsor-card-${orientation}.${videoExt}`,
    );
  };

  const handleDownloadImage = async () => {
    if (!ready) return;
    try {
      const blob = await renderSponsorCardStill(
        { tier, logoUrls: logos.map((l) => l.url) },
        orientation,
      );
      downloadBlob(
        blob,
        `tbc-conference-26-${tier}-sponsor-card-${orientation}.png`,
      );
    } catch (err) {
      console.error(err);
    }
  };

  const stepClass = (step: number, complete: boolean) =>
    `flex flex-col gap-3.5 rounded-lg border p-6 transition-colors ${
      activeStep === step
        ? "border-line-strong bg-white/[0.04]"
        : complete
          ? "border-line"
          : "border-line-subtle opacity-60"
    }`;

  const StepHeader = ({
    n,
    title,
    complete,
  }: {
    n: number;
    title: string;
    complete: boolean;
  }) => (
    <div className="flex items-center gap-2">
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          complete
            ? "bg-track-education/20 text-track-education"
            : activeStep === n
              ? "bg-gradient-tbc text-black"
              : "border border-line text-muted"
        }`}
      >
        {complete ? <CheckIcon className="h-3.5 w-3.5" /> : n}
      </span>
      <Text textType="lgsmall" className="font-bold">
        {title}
      </Text>
      {activeStep === n && (
        <span className="ml-1 rounded-full bg-gradient-tbc px-2 py-0.5 text-xs font-bold text-black">
          Start here
        </span>
      )}
    </div>
  );

  return (
    <div className="card-tbc flex flex-col gap-8 p-7 lg:flex-row lg:items-start lg:gap-10">
      <div className="flex flex-1 flex-col gap-5">
        {/* Step 1 — tier */}
        <div className={stepClass(1, true)}>
          <StepHeader n={1} title="Sponsor tier" complete />
          <Text textType="small" className="text-muted">
            Each tier gets its own colour, ring and logo count, per the
            sponsorship deck: Platinum and Gold are announced individually,
            Silver in groups of 3, Bronze in groups of 5.
          </Text>
          <div className="flex flex-wrap gap-2">
            {SPONSOR_TIERS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleTierChange(t)}
                className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm capitalize transition-colors ${
                  tier === t
                    ? "border-line-strong bg-white/10 text-white"
                    : "border-line text-muted hover:text-white"
                }`}
              >
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ background: TIER_SWATCH[t] }}
                  aria-hidden
                />
                {t}
                <span className="text-faint">
                  · {TIER_LOGO_COUNT[t]}
                  {TIER_LOGO_COUNT[t] === 1 ? " logo" : " logos"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2 — logos */}
        <div className={stepClass(2, ready)}>
          <StepHeader
            n={2}
            title={`Upload ${requiredCount} sponsor logo${requiredCount === 1 ? "" : "s"}`}
            complete={ready}
          />
          <div className="flex items-center justify-between">
            <Text textType="small" className="text-muted">
              PNG or SVG with a transparent background works best.
            </Text>
            <Text
              textType="small"
              className={`shrink-0 font-bold ${ready ? "text-track-education" : "text-faint"}`}
            >
              {logos.length}/{requiredCount}
            </Text>
          </div>
          <input
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            multiple
            disabled={logos.length >= requiredCount}
            onChange={handleFilesChange}
            className="w-full cursor-pointer rounded-md border border-dashed border-line bg-black px-4 py-3 text-sm text-secondary file:mr-3 file:rounded-sm file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-white disabled:cursor-not-allowed disabled:opacity-50"
          />
          {hasLogos && (
            <div className="flex flex-wrap gap-2.5">
              {logos.map((logo, i) => (
                <div
                  key={logo.url}
                  className="group relative flex h-16 w-16 items-center justify-center rounded-md border border-line bg-white/5 p-2"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.url}
                    alt={`Sponsor logo ${i + 1}`}
                    className="max-h-full max-w-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => removeLogo(i)}
                    aria-label={`Remove logo ${i + 1}`}
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-white opacity-0 ring-1 ring-line-strong transition-opacity group-hover:opacity-100"
                  >
                    <Cross1Icon className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Step 3 — format + generate */}
        <div className={stepClass(3, false)}>
          <StepHeader n={3} title="Format and generate" complete={false} />
          <div className="flex flex-wrap gap-2">
            {(["landscape", "portrait"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setOrientation(opt)}
                className={`rounded-full border px-4 py-1.5 text-sm capitalize transition-colors ${
                  orientation === opt
                    ? "border-line-strong bg-white/10 text-white"
                    : "border-line text-muted hover:text-white"
                }`}
              >
                {opt} {opt === "landscape" ? "(16:9)" : "(4:5)"}
              </button>
            ))}
          </div>
          <div>
            <Button
              buttonType="cta"
              disabled={!ready || status === "generating"}
              onClick={handleGenerate}
            >
              {status === "generating"
                ? `Rendering… ${Math.round(progress * 100)}%`
                : "Generate card"}
            </Button>
          </div>
          {errorMsg && (
            <Text textType="small" className="text-track-regulation max-w-sm">
              {errorMsg}
            </Text>
          )}
        </div>

        {videoBlob && (
          <div className="flex flex-wrap gap-3">
            <Button
              buttonType="cta"
              onClick={handleDownloadVideo}
              className="w-fit"
            >
              Download video ({videoExt.toUpperCase()})
            </Button>
            <Button
              buttonType="secondary"
              onClick={handleDownloadImage}
              className="w-fit"
            >
              Download still (PNG)
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-1 items-center justify-center rounded-lg bg-black/40 p-4">
        {videoUrl ? (
          <video
            src={videoUrl}
            className="max-h-[420px] w-full rounded-md"
            controls
            autoPlay
            loop
            muted
            playsInline
          />
        ) : hasLogos ? (
          <div className="flex flex-col items-center gap-3">
            <Text textType="small" className="font-bold">
              {TIER_LABEL[tier]}
            </Text>
            <Text textType="small" className="text-faint">
              {ready
                ? "Ready. Click Generate."
                : `${logos.length}/${requiredCount} logos — add ${requiredCount - logos.length} more.`}
            </Text>
          </div>
        ) : (
          <Text textType="small" className="text-faint text-center">
            Your animated card preview will appear here
          </Text>
        )}
      </div>
    </div>
  );
};

export default SponsorCardGenerator;
