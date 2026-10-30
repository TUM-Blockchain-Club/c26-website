import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import {
  STAGE_BASE,
  STAGE_COOKIE,
  passOk,
} from "@/components/stage/stageAccess";

/**
 * The Hackathon opening, a self-contained HTML deck built outside this site.
 * It lives outside `public/` so it sits behind the stage passcode too.
 */
export async function GET(request: NextRequest) {
  if (!(await passOk(request.cookies.get(STAGE_COOKIE)?.value))) {
    const login = new URL(`${STAGE_BASE}/login`, request.url);
    login.searchParams.set("next", `${STAGE_BASE}/hackathon`);
    return NextResponse.redirect(login);
  }
  const html = await readFile(
    path.join(process.cwd(), "stage-decks/hackathon-opening.html"),
  );
  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
