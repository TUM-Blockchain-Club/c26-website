import { NextResponse, type NextRequest } from "next/server";
import {
  STAGE_BASE,
  STAGE_COOKIE,
  passOk,
} from "@/components/stage/stageAccess";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const pass = String(form.get("passcode") ?? "").trim();
  const nextRaw = String(form.get("next") ?? STAGE_BASE);
  // Only ever send people back into the stage pages.
  const next = nextRaw.startsWith(STAGE_BASE) ? nextRaw : STAGE_BASE;
  if (!(await passOk(pass))) {
    const back = new URL(`${STAGE_BASE}/login`, request.url);
    back.searchParams.set("next", next);
    back.searchParams.set("error", "1");
    return NextResponse.redirect(back, 303);
  }
  const res = NextResponse.redirect(new URL(next, request.url), 303);
  res.cookies.set(STAGE_COOKIE, pass, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: STAGE_BASE,
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
