"use client";

import { useState } from "react";
import { Text } from "@/components/text";
import { Button } from "@/components/button";
import { DownloadIcon } from "@radix-ui/react-icons";
import { downloadBlob } from "@/util/exportLogo";
import { galleryImages } from "@/constants/mediaPortal";

export const MediaGallery = () => {
  const [zipping, setZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);

  const handleDownloadAll = async () => {
    setZipping(true);
    setZipProgress(0);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      for (let i = 0; i < galleryImages.length; i++) {
        const image = galleryImages[i];
        const blob = await fetch(image.full).then((res) => res.blob());
        // JPEGs are already compressed, so store them as they are.
        zip.file(`${image.id}.jpg`, blob, { compression: "STORE" });
        setZipProgress(i + 1);
      }
      const zipBlob = await zip.generateAsync({ type: "blob" });
      downloadBlob(zipBlob, "tbc-conference-25-photos.zip");
    } catch (err) {
      console.error("Photo zip failed:", err);
    } finally {
      setZipping(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Text as="p" textType="small" className="text-muted">
          {galleryImages.length} photos, high resolution. Hover or tap a photo
          to download it on its own.
        </Text>
        <Button buttonType="cta" disabled={zipping} onClick={handleDownloadAll}>
          {zipping
            ? `Preparing… ${zipProgress}/${galleryImages.length}`
            : "Download all (.zip)"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {galleryImages.map((image, i) => (
          <div
            key={image.id}
            className="group relative overflow-hidden rounded-lg border border-line"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.web}
              alt={`TUM Blockchain Conference 25 photo ${i + 1}`}
              loading="lazy"
              className="aspect-[3/2] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <a
              href={image.full}
              download={`${image.id}.jpg`}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-line-strong bg-black/70 px-3 py-1.5 text-xs font-bold text-white no-underline backdrop-blur transition-opacity hover:bg-black/90 hover:no-underline sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            >
              <DownloadIcon className="h-3.5 w-3.5" />
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
