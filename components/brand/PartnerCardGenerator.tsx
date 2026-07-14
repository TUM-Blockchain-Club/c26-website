"use client";

import { useEffect, useState } from "react";
import { Text } from "@/components/text";
import { Button } from "@/components/button";
import { CheckIcon } from "@radix-ui/react-icons";
import { downloadBlob } from "@/util/exportLogo";
import {
  renderPartnerCardVideo,
  renderPartnerCardStill,
  type CardOrientation,
} from "@/util/partnerCardVideo";

type Status = "idle" | "generating" | "ready" | "error";

const MAX_SIZE = 5 * 1024 * 1024;

export const PartnerCardGenerator = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [orgName, setOrgName] = useState("");
  const [orientation, setOrientation] = useState<CardOrientation>("landscape");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoExt, setVideoExt] = useState<"mp4" | "webm">("webm");
  const [note, setNote] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const hasLogo = !!file && !!previewUrl;
  const hasName = orgName.trim().length > 0;
  const ready = hasLogo && hasName;
  // Which step should be visually highlighted next.
  const activeStep = !hasLogo ? 1 : !hasName ? 2 : 3;

  const clearOutput = () => {
    setVideoUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setVideoBlob(null);
    setStatus("idle");
    setProgress(0);
    setNote(null);
  };

  // Drop any previously generated card when an input changes. Runs after
  // render, so it can never interfere with typing in the inputs.
  useEffect(() => {
    setVideoUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setVideoBlob(null);
    setStatus("idle");
    setProgress(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgName, previewUrl, orientation]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    clearOutput();
    setErrorMsg(null);

    if (selected.size > MAX_SIZE) {
      setErrorMsg("That file is larger than 5MB. Please use a smaller image.");
      return;
    }

    const url = URL.createObjectURL(selected);
    // Only confirm the file decodes as an image (SVGs may report no intrinsic
    // size, which is fine — the renderer scales them to fit).
    const probe = new Image();
    probe.onload = () => {
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
      setFile(selected);
    };
    probe.onerror = () => {
      URL.revokeObjectURL(url);
      setErrorMsg(
        "That file could not be loaded as an image. Try a PNG or JPEG.",
      );
    };
    probe.src = url;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Keep this handler minimal so a keystroke can never be dropped.
    setOrgName(e.target.value);
  };

  const persistUpload = async (selected: File, companyName: string) => {
    // Best effort and invisible to the partner: whether the logo could be
    // stored server-side is an internal concern and never blocks the card.
    try {
      const formData = new FormData();
      formData.append("logo", selected);
      formData.append("companyName", companyName);
      await fetch("/api/partner-logo-upload", {
        method: "POST",
        body: formData,
      });
    } catch {
      // Ignore: the generator works entirely client-side.
    }
  };

  const handleGenerate = async () => {
    if (!file || !previewUrl || !hasName) return;
    setStatus("generating");
    setProgress(0);
    setErrorMsg(null);
    const name = orgName.trim();

    await persistUpload(file, name);

    try {
      const { blob, extension } = await renderPartnerCardVideo(
        previewUrl,
        orientation,
        name,
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
      console.error(
        "Video generation failed, falling back to still image:",
        err,
      );
      // Fallback: at least produce the still image so the user gets a result.
      try {
        const still = await renderPartnerCardStill(
          previewUrl,
          orientation,
          name,
        );
        downloadBlob(
          still,
          `tbc-conference-26-partner-card-${orientation}.png`,
        );
        setNote(
          "Your browser could not record the animation, so we downloaded the still image instead.",
        );
        setStatus("idle");
      } catch (err2) {
        console.error(err2);
        setErrorMsg(
          "Something went wrong generating the card. Please try another logo.",
        );
        setStatus("error");
      }
    }
  };

  const handleDownloadVideo = () => {
    if (!videoBlob) return;
    downloadBlob(
      videoBlob,
      `tbc-conference-26-partner-card-${orientation}.${videoExt}`,
    );
  };

  const handleDownloadImage = async () => {
    if (!previewUrl || !hasName) return;
    try {
      const blob = await renderPartnerCardStill(
        previewUrl,
        orientation,
        orgName.trim(),
      );
      downloadBlob(blob, `tbc-conference-26-partner-card-${orientation}.png`);
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
            PNG, JPEG, WebP or SVG. Max 5MB. A transparent background works
            best. We automatically place it on a light or dark panel so it stays
            visible.
          </Text>
          <input
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            onChange={handleFileChange}
            className="w-full cursor-pointer rounded-md border border-dashed border-line bg-black px-4 py-3 text-sm text-secondary file:mr-3 file:rounded-sm file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-white"
          />
        </div>

        {/* Step 2 — name */}
        <div className={stepClass(2, hasName)}>
          <StepHeader n={2} title="Your organisation name" complete={hasName} />
          <Text textType="small" className="text-muted">
            This is animated onto the card next to your logo.
          </Text>
          <input
            type="text"
            value={orgName}
            onChange={handleNameChange}
            placeholder="e.g. Your Organisation"
            maxLength={40}
            className="w-full rounded-md border border-line bg-black px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-faint focus:border-line-strong"
          />
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
          {note && (
            <Text textType="small" className="text-faint max-w-sm">
              {note}
            </Text>
          )}
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
              {hasName
                ? "Ready. Click Generate."
                : "Now add your organisation name."}
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
