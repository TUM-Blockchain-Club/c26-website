"use client";

import { useEffect, useMemo, useState } from "react";
import { Text } from "@/components/text";
import { Button } from "@/components/button";
import { CopyButton } from "@/components/brand/CopyButton";
import { CheckIcon } from "@radix-ui/react-icons";
import { downloadBlob } from "@/util/exportLogo";
import {
  renderAttendeeCardVideo,
  SPEAKER_LIMITS,
  type CardOrientation,
} from "@/util/partnerCardVideo";
import { buildAttendeeCaptions } from "@/util/attendeeCaptions";

type Status = "idle" | "generating" | "ready" | "error";

// Reject only truly huge files early; anything smaller is downscaled to fit.
const MAX_UPLOAD = 40 * 1024 * 1024;
// Longest side we keep — the photo panel on the card is small, so this is
// plenty of detail while keeping the file well under a few hundred KB.
const MAX_DIM = 1600;
// Keep the original untouched only if it is already this small.
const KEEP_ORIGINAL_UNDER = 5 * 1024 * 1024;

function loadImageElement(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Not a decodable image"));
    img.src = url;
  });
}

/**
 * Loads a photo and, if it is large, downscales it and re-encodes as JPEG so
 * big phone photos fit comfortably without asking the user to resize anything.
 * SVGs are vector and tiny, so they pass through untouched.
 */
async function preparePhoto(file: File): Promise<{ url: string; file: File }> {
  if (file.type === "image/svg+xml") {
    return { url: URL.createObjectURL(file), file };
  }

  const srcUrl = URL.createObjectURL(file);
  let img: HTMLImageElement;
  try {
    img = await loadImageElement(srcUrl);
  } catch (err) {
    URL.revokeObjectURL(srcUrl);
    throw err;
  }

  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  const scale = Math.min(1, MAX_DIM / Math.max(w, h || 1));

  // Already small and modest in size — no need to touch it.
  if (scale === 1 && file.size <= KEEP_ORIGINAL_UNDER) {
    return { url: srcUrl, file };
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(w * scale));
  canvas.height = Math.max(1, Math.round(h * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) return { url: srcUrl, file };
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(srcUrl);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/jpeg", 0.85),
  );
  if (!blob) throw new Error("Could not compress the image");

  const base = file.name.replace(/\.[^.]+$/, "") || "photo";
  const compressed = new File([blob], `${base}.jpg`, { type: "image/jpeg" });
  return { url: URL.createObjectURL(blob), file: compressed };
}

export const AttendeeCardGenerator = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [job, setJob] = useState("");
  const [blurb, setBlurb] = useState("");
  const [orientation, setOrientation] = useState<CardOrientation>("landscape");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoExt, setVideoExt] = useState<"mp4" | "webm">("webm");
  const [note, setNote] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const hasPhoto = !!file && !!previewUrl;
  const hasName = name.trim().length > 0;
  const ready = hasPhoto && hasName;
  const activeStep = !hasPhoto ? 1 : !hasName ? 2 : 3;

  // Ready-to-post captions, personalised to what the attendee entered so far.
  const captions = useMemo(
    () => buildAttendeeCaptions({ job, blurb }),
    [job, blurb],
  );

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

  useEffect(() => {
    setVideoUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setVideoBlob(null);
    setStatus("idle");
    setProgress(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, job, blurb, previewUrl, orientation]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    clearOutput();
    setErrorMsg(null);

    if (selected.size > MAX_UPLOAD) {
      setErrorMsg("That file is very large. Please use an image under 40MB.");
      return;
    }

    try {
      // Large photos are downscaled and re-encoded automatically to fit.
      const prepared = await preparePhoto(selected);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return prepared.url;
      });
      setFile(prepared.file);
    } catch {
      setErrorMsg(
        "That file could not be loaded as an image. Try a PNG or JPEG.",
      );
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleGenerate = async () => {
    if (!file || !previewUrl || !hasName) return;
    setStatus("generating");
    setProgress(0);
    setErrorMsg(null);

    const content = {
      name: name.trim(),
      job: job.trim() || undefined,
      blurb: blurb.trim() || undefined,
    };

    try {
      const { blob, extension } = await renderAttendeeCardVideo(
        previewUrl,
        orientation,
        content,
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
      `tbc-conference-26-attendee-card-${orientation}.${videoExt}`,
    );
  };

  const inputClass =
    "w-full rounded-md border border-line bg-black px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-faint focus:border-line-strong";

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
    <div className="flex flex-col gap-8">
      <div className="card-tbc flex flex-col gap-8 p-7 lg:flex-row lg:items-start lg:gap-10">
        <div className="flex flex-1 flex-col gap-5">
          {/* Step 1 — photo */}
          <div className={stepClass(1, hasPhoto)}>
            <StepHeader n={1} title="Upload your photo" complete={hasPhoto} />
            <Text textType="small" className="text-muted">
              A headshot works best. PNG, JPEG, WebP or SVG; large photos are
              resized automatically. Tip: upload a PNG with the background
              already removed and just you will appear on the brand background.
            </Text>
            <input
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              onChange={handleFileChange}
              className="w-full cursor-pointer rounded-md border border-dashed border-line bg-black px-4 py-3 text-sm text-secondary file:mr-3 file:rounded-sm file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-white"
            />
          </div>

          {/* Step 2 — about you */}
          <div className={stepClass(2, hasName)}>
            <StepHeader n={2} title="About you" complete={hasName} />
            <Text textType="small" className="text-muted">
              Your name is required; role and what you&apos;re excited about are
              optional. The counters show how much fits so the card always looks
              good.
            </Text>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label htmlFor="at-name" className="text-xs text-muted">
                  Name
                </label>
                <span className="text-xs text-faint">
                  {name.length}/{SPEAKER_LIMITS.name}
                </span>
              </div>
              <input
                id="at-name"
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="e.g. Your Name"
                maxLength={SPEAKER_LIMITS.name}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label htmlFor="at-job" className="text-xs text-muted">
                  Role / company <span className="text-faint">(optional)</span>
                </label>
                <span className="text-xs text-faint">
                  {job.length}/{SPEAKER_LIMITS.job}
                </span>
              </div>
              <input
                id="at-job"
                type="text"
                value={job}
                onChange={(e) => setJob(e.target.value)}
                placeholder="e.g. Student at TUM"
                maxLength={SPEAKER_LIMITS.job}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label htmlFor="at-blurb" className="text-xs text-muted">
                  What are you most excited about?{" "}
                  <span className="text-faint">(optional)</span>
                </label>
                <span className="text-xs text-faint">
                  {blurb.length}/{SPEAKER_LIMITS.blurb}
                </span>
              </div>
              <textarea
                id="at-blurb"
                value={blurb}
                onChange={(e) => setBlurb(e.target.value)}
                placeholder="e.g. The Digital Assets Day panels, or the Hackathon…"
                maxLength={SPEAKER_LIMITS.blurb}
                rows={3}
                className={`${inputClass} resize-y`}
              />
            </div>
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
                alt="Uploaded photo preview"
                className="max-h-40 max-w-[240px] object-contain"
              />
              <Text textType="small" className="text-faint">
                {hasName ? "Ready. Click Generate." : "Now add your name."}
              </Text>
            </div>
          ) : (
            <Text textType="small" className="text-faint text-center">
              Your animated card preview will appear here
            </Text>
          )}
        </div>
      </div>

      {hasName && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Text textType="lgsmall" className="font-bold">
              Suggested posts
            </Text>
            <Text textType="small" className="text-muted max-w-lg">
              Personalised to what you entered above, with the club tagged. Pair
              any of these with your downloaded video.
            </Text>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {captions.map((c) => (
              <div
                key={c.platform}
                className="card-tbc-soft flex min-w-0 flex-col gap-3 p-5"
              >
                <Text as="p" textType="small" className="font-bold">
                  {c.platform}
                </Text>
                <Text
                  as="p"
                  textType="small"
                  className="text-secondary min-w-0 whitespace-pre-line break-words"
                >
                  {c.text}
                </Text>
                <div className="mt-auto pt-2">
                  <CopyButton
                    value={c.text}
                    label={`Copy ${c.platform} text`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendeeCardGenerator;
