"use client";

import { useEffect, useState } from "react";
import { Text } from "@/components/text";
import { Button } from "@/components/button";
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";
import { downloadBlob } from "@/util/exportLogo";
import { prepareImage } from "@/util/imageCompression";
import {
  renderSponsorCardVideo,
  renderSponsorCardStill,
  SPONSOR_TIER_TRACKS,
  TIER_LABEL,
  type SponsorTier,
  type CardOrientation,
} from "@/util/partnerCardVideo";

type Status = "idle" | "generating" | "ready" | "error";
type LogoEntry = { file: File; url: string };

// Reject only truly huge files early; anything smaller is downscaled to fit.
const MAX_UPLOAD = 25 * 1024 * 1024;
// Longest side we keep — generous enough for a crisp logo even at a large
// on-card size. Always re-encoded as PNG (no jpegQuality passed below), so
// this only ever trims resolution, never colour or transparency.
const MAX_LOGO_DIM = 1800;

const TIER_SWATCH: Record<SponsorTier, string> = {
  platinum: "linear-gradient(135deg, #ffffff, #96b9ff)",
  gold: "linear-gradient(135deg, #ffe096, #a36e19)",
  silver: "linear-gradient(135deg, #ebeff3, #788696)",
  bronze: "linear-gradient(135deg, #e4aa78, #7a4828)",
  premium: "linear-gradient(135deg, #ffcd78, #7846e6)",
  standard: "linear-gradient(135deg, #bed7ff, #3250aa)",
  travel: "linear-gradient(135deg, #b4f0e1, #1e6e78)",
};

export const SponsorCardGenerator = () => {
  const [tier, setTier] = useState<SponsorTier>("platinum");
  const [logo, setLogo] = useState<LogoEntry | null>(null);
  const [savingImage, setSavingImage] = useState(false);
  const [orientation, setOrientation] = useState<CardOrientation>("landscape");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoExt, setVideoExt] = useState<"mp4" | "webm">("webm");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // One sponsor per card, whatever the tier.
  const ready = logo !== null;
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
  }, [tier, logo, orientation]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    e.target.value = "";
    if (!selected) return;

    clearOutput();
    setErrorMsg(null);

    if (selected.size > MAX_UPLOAD) {
      setErrorMsg("That file is very large. Use a file under 25MB.");
      return;
    }

    try {
      // Large logos are downscaled and re-encoded as PNG automatically, which
      // is lossless, so this never trades away sharpness or transparency.
      const prepared = await prepareImage(selected, { maxDim: MAX_LOGO_DIM });
      setLogo((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return prepared;
      });
    } catch {
      setErrorMsg(
        "That file could not be loaded as an image. Try a PNG or SVG.",
      );
    }
  };

  const removeLogo = () => {
    clearOutput();
    setLogo((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return null;
    });
  };

  const handleGenerate = async () => {
    if (!ready) return;
    setStatus("generating");
    setProgress(0);
    setErrorMsg(null);

    const content = { tier, logoUrls: [logo!.url] };

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

  // The still is the card's end state, so it works wherever a video is
  // awkward to post — and it does not wait on a video being generated first.
  const handleDownloadImage = async () => {
    if (!ready || savingImage) return;
    setSavingImage(true);
    setErrorMsg(null);
    try {
      const blob = await renderSponsorCardStill(
        { tier, logoUrls: [logo!.url] },
        orientation,
      );
      downloadBlob(
        blob,
        `tbc-conference-26-${tier}-sponsor-card-${orientation}.png`,
      );
    } catch (err) {
      console.error("Still image generation failed:", err);
      setErrorMsg("The image could not be created. Please try again.");
    } finally {
      setSavingImage(false);
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
            Every card announces one sponsor. The conference and the Hackathon
            have their own tier ladders; each tier brings its own colour and
            ring, and the card names which of the two it belongs to.
          </Text>
          <div className="flex flex-col gap-3">
            {SPONSOR_TIER_TRACKS.map((track) => (
              <div key={track.key} className="flex flex-col gap-1.5">
                <span className="text-xs uppercase tracking-[0.2em] text-faint">
                  {track.label}
                </span>
                <div className="flex flex-wrap gap-2">
                  {track.tiers.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTier(t)}
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
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2 — logo */}
        <div className={stepClass(2, ready)}>
          <StepHeader
            n={2}
            title="Upload the sponsor's logo"
            complete={ready}
          />
          <Text textType="small" className="text-muted">
            PNG or SVG with a transparent background works best. The card puts
            dark logos on a white plate and light ones on a dark glass plate, so
            either kind reads. Large files are downscaled automatically,
            losslessly.
          </Text>
          <input
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            onChange={handleFileChange}
            className="w-full cursor-pointer rounded-md border border-dashed border-line bg-black px-4 py-3 text-sm text-secondary file:mr-3 file:rounded-sm file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-white"
          />
          {logo && (
            <div className="group relative flex h-24 w-40 items-center justify-center rounded-md border border-line bg-white/5 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.url}
                alt="Sponsor logo"
                className="max-h-full max-w-full object-contain"
              />
              <button
                type="button"
                onClick={removeLogo}
                aria-label="Remove logo"
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-white opacity-0 ring-1 ring-line-strong transition-opacity group-hover:opacity-100"
              >
                <Cross1Icon className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>

        {/* Step 3 — format + generate */}
        <div className={stepClass(3, false)}>
          <StepHeader n={3} title="Format and download" complete={false} />
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
          <div className="flex flex-wrap gap-3">
            <Button
              buttonType="cta"
              disabled={!ready || status === "generating"}
              onClick={handleGenerate}
            >
              {status === "generating"
                ? `Rendering… ${Math.round(progress * 100)}%`
                : "Generate video"}
            </Button>
            <Button
              buttonType="primary"
              disabled={!ready || savingImage}
              onClick={handleDownloadImage}
            >
              {savingImage ? "Rendering…" : "Download image (PNG)"}
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
        ) : ready ? (
          <div className="flex flex-col items-center gap-3">
            <Text textType="small" className="font-bold">
              {TIER_LABEL[tier]}
            </Text>
            <Text textType="small" className="text-faint">
              Ready. Generate the video or download the image.
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
