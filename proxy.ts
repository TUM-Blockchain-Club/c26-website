import { NextResponse, type NextRequest } from "next/server";
import {
  STAGE_BASE,
  STAGE_COOKIE,
  passOk,
} from "@/components/stage/stageAccess";

/** Keeps the stage screens behind their passcode; see stageAccess.ts. */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname === `${STAGE_BASE}/login`) return NextResponse.next();
  if (await passOk(request.cookies.get(STAGE_COOKIE)?.value)) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    res.headers.set("Cache-Control", "private, no-store");
    return res;
  }
  const login = new URL(`${STAGE_BASE}/login`, request.url);
  login.searchParams.set("next", pathname + search);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/stage-76803f8f95", "/stage-76803f8f95/:path*"],
};
