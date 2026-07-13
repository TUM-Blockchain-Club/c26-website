import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

// NOTE: this writes to the local filesystem under /public. That only
// persists on a traditional long-lived server (e.g. `next start` on a VPS)
// or in local dev. On Vercel's serverless deployment, the filesystem is
// read-only outside /tmp, and /tmp is wiped between invocations, so uploads
// here will fail (caught below) or silently disappear in that environment.
const UPLOAD_DIR = path.join(process.cwd(), "public", "communitypartner-logos");
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/svg+xml": "svg",
  "image/webp": "webp",
};

/** "Example Partner GmbH" → "example-partner-gmbh" */
function slugifyCompanyName(name: string): string {
  return (
    name
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "partner"
  );
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("logo");
  const companyName = formData.get("companyName");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (typeof companyName !== "string" || !companyName.trim()) {
    return NextResponse.json(
      { error: "No company name provided" },
      { status: 400 },
    );
  }
  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: "Unsupported file type" },
      { status: 400 },
    );
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "File too large (max 5MB)" },
      { status: 400 },
    );
  }

  const filename = `${slugifyCompanyName(companyName)}.${extension}`;

  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(UPLOAD_DIR, filename), buffer);
  } catch (err) {
    console.error("Partner logo upload failed to persist:", err);
    return NextResponse.json(
      {
        error:
          "Could not save the file on the server (this only works on a persistent filesystem, not serverless hosting). The card generator will still work for this session.",
        persisted: false,
      },
      { status: 200 },
    );
  }

  return NextResponse.json({ persisted: true, filename });
}
