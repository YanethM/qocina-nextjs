import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const VALID_SITE_CODES = new Set(["pe", "us", "es", "mx", "ar", "co", "ec", "cl"]);
const DEFAULT_SITE = "pe";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const firstSegment = pathname.split("/")[1];
  const siteCode = VALID_SITE_CODES.has(firstSegment) ? firstSegment : DEFAULT_SITE;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-site-code", siteCode);

  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${DEFAULT_SITE}`, request.url));
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|api).*)"],
};
