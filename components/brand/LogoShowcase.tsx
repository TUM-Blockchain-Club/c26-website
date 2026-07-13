"use client";

import { useState } from "react";
import Image from "next/image";
import { Text } from "@/components/text";
import { Button } from "@/components/button";
import { logoAssets, type LogoAsset } from "@/constants/brandAssets";
import { downloadBlob, svgToPngBlob } from "@/util/exportLogo";

const PNG_EXPORT_WIDTH = 1600;

const LogoCard = ({ asset }: { asset: LogoAsset }) => {
  const [exporting, setExporting] = useState(false);

  const handlePngDownload = async () => {
    setExporting(true);
    try {
      const blob = await svgToPngBlob(asset.svgSrc, PNG_EXPORT_WIDTH);
      downloadBlob(blob, `${asset.id}.png`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="card-tbc-soft flex flex-col overflow-hidden">
      <div className="flex h-40 items-center justify-center bg-black p-8">
        <Image
          src={asset.svgSrc}
          alt={asset.name}
          width={400}
          height={140}
          className="h-full w-auto object-contain"
        />
      </div>
      <div className="flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-1.5">
          <Text as="p" textType="lgsmall" className="font-bold">
            {asset.name}
          </Text>
          <Text as="p" textType="small" className="text-muted">
            {asset.description}
          </Text>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            buttonType="secondary"
            asChild
            className="text-xs px-3 py-1.5"
          >
            <a href={asset.svgSrc} download>
              Download SVG
            </a>
          </Button>
          <Button
            buttonType="secondary"
            className="text-xs px-3 py-1.5"
            disabled={exporting}
            onClick={handlePngDownload}
          >
            {exporting ? "Exporting…" : "Download PNG"}
          </Button>
        </div>
      </div>
    </div>
  );
};

/** Public-facing: just the two real logo files, ready to download. */
export const LogoDownloads = () => {
  const [zipping, setZipping] = useState(false);

  const handleDownloadAll = async () => {
    setZipping(true);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      for (const asset of logoAssets) {
        const svgText = await fetch(asset.svgSrc).then((r) => r.text());
        zip.file(`${asset.id}.svg`, svgText);
        const pngBlob = await svgToPngBlob(asset.svgSrc, PNG_EXPORT_WIDTH);
        zip.file(`${asset.id}.png`, pngBlob);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      downloadBlob(zipBlob, "tbc-conference-26-logos.zip");
    } finally {
      setZipping(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Text textType="sub_title" className="font-bold">
          Logos
        </Text>
        <Button buttonType="cta" disabled={zipping} onClick={handleDownloadAll}>
          {zipping ? "Zipping…" : "Download all (.zip)"}
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {logoAssets.map((asset) => (
          <LogoCard key={asset.id} asset={asset} />
        ))}
      </div>
    </div>
  );
};
