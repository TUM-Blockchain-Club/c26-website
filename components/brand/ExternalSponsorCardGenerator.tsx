"use client";

import { useEffect, useState } from "react";
import { Text } from "@/components/text";
import { Button } from "@/components/button";
import { CheckIcon } from "@radix-ui/react-icons";
import { downloadBlob } from "@/util/exportLogo";
import { prepareImage } from "@/util/imageCompression";
import {
  renderSponsorCardVideo,
  renderSponsorCardStill,
  type CardOrientation,
} from "@/util/partnerCardVideo";

type Status = "idle" | "generating" | "ready" | "error";

// Reject only truly huge files early; anything smaller is downscaled to fit.
const MAX_UPLOAD = 25 * 1024 * 1024;
// Longest side we keep — generous enough for a crisp logo even at a large
// on-card size. Always re-encoded as PNG, so this only ever trims
// resolution, never colour or transparency.
const MAX_LOGO_DIM = 1800;

export const ExternalSponsorCardGenerator = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [orientation, setOrientation] = useState<CardOrientation>("landscape");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoExt, setVideoExt] = useState<"mp4" | "webm">("webm");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const hasLogo = !!file && !!previewUrl;
  const activeStep = !hasLogo ? 1 : 2;

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
  }, [previewUrl, orientation]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    e.target.value = "";
    if (!selected) return;

    clearOutput();
    setErrorMsg(null);

    if (selected.size > MAX_UPLOAD) {
      setErrorMsg("That file is very large. Please use an image under 25MB.");
      return;
    }

    try {
      const prepared = await prepareImage(selected, { maxDim: MAX_LOGO_DIM });
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return prepared.url;
      });
      setFile(prepared.file);
    } catch {
      setErrorMsg(
        "That file could not be loaded as an image. Try a PNG or SVG.",
      );
    }
  };

  const handleGenerate = async () => {
    if (!hasLogo || !previewUrl) return;
    setStatus("generating");
    setProgress(0);
    setErrorMsg(null);

    try {
      const { blob, extension } = await renderSponsorCardVideo(
        { logoUrls: [previewUrl] },
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
      `tbc-conference-26-sponsor-card-${orientation}.${videoExt}`,
    );
  };

  const handleDownloadImage = async () => {
    if (!hasLogo || !previewUrl) return;
    try {
      const blob = await renderSponsorCardStill(
        { logoUrls: [previewUrl] },
        orientation,
      );
      downloadBlob(blob, `tbc-conference-26-sponsor-card-${orientation}.png`);
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
        {/* Step 1 — logo */}
        <div className={stepClass(1, hasLogo)}>
          <StepHeader n={1} title="Upload your logo" complete={hasLogo} />
          <Text textType="small" className="text-muted">
            PNG or SVG with a transparent background works best. Large files are
            downscaled automatically, losslessly.
          </Text>
          <input
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            onChange={handleFileChange}
            className="w-full cursor-pointer rounded-md border border-dashed border-line bg-black px-4 py-3 text-sm text-secondary file:mr-3 file:rounded-sm file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-white"
          />
        </div>

        {/* Step 2 — format + generate */}
        <div className={stepClass(2, false)}>
          <StepHeader n={2} title="Format and generate" complete={false} />
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
              disabled={!hasLogo || status === "generating"}
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
        ) : previewUrl ? (
          <div className="flex flex-col items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Uploaded logo preview"
              className="max-h-40 max-w-[240px] object-contain"
            />
            <Text textType="small" className="text-faint">
              Ready. Click Generate.
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

export default ExternalSponsorCardGenerator;
