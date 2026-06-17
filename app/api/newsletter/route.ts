export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 10;

import { NextResponse } from "next/server";

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_LIST_ADDRESS = process.env.MAILGUN_LIST_ADDRESS;
const MAILGUN_API_BASE =
  process.env.MAILGUN_API_BASE || "https://api.eu.mailgun.net";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface NewsletterRequest {
  email?: unknown;
  source?: unknown;
  website?: unknown;
}

export const POST = async (request: Request): Promise<NextResponse> => {
  let body: NewsletterRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (typeof body.email !== "string") {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const email = body.email.trim().toLowerCase();
  const source =
    typeof body.source === "string" && body.source.length <= 80
      ? body.source
      : "c26-website";

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return NextResponse.json(
      { error: "Enter a valid email address" },
      { status: 400 },
    );
  }

  if (!MAILGUN_API_KEY || !MAILGUN_LIST_ADDRESS) {
    console.error("Mailgun newsletter integration is not configured");
    return NextResponse.json(
      { error: "Newsletter signup is not configured" },
      { status: 500 },
    );
  }

  const formData = new FormData();
  formData.set("address", email);
  formData.set("subscribed", "true");
  formData.set(
    "vars",
    JSON.stringify({
      source,
      subscribedAt: new Date().toISOString(),
    }),
  );

  const response = await fetch(
    `${MAILGUN_API_BASE}/v3/lists/${encodeURIComponent(
      MAILGUN_LIST_ADDRESS,
    )}/members`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString(
          "base64",
        )}`,
      },
      body: formData,
    },
  );

  if (response.ok) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const responseText = await response.text();

  if (
    response.status === 400 &&
    responseText.toLowerCase().includes("already")
  ) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  console.error("Mailgun newsletter signup failed", {
    status: response.status,
    response: responseText,
  });

  return NextResponse.json(
    { error: "Could not subscribe right now" },
    { status: 502 },
  );
};
