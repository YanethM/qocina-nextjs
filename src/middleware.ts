import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const VALID_SITE_CODES = new Set(["pe", "us", "es", "mx", "ar", "co", "ec", "cl"]);
const DEFAULT_SITE = "pe";
const SITE_CODE_COOKIE = "site-code";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const firstSegment = pathname.split("/")[1];
  const hasSiteCode = VALID_SITE_CODES.has(firstSegment);
  const siteCode = hasSiteCode ? firstSegment : DEFAULT_SITE;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-site-code", siteCode);

  if (!hasSiteCode) {
    const cookieSiteCode = request.cookies.get(SITE_CODE_COOKIE)?.value;
    const targetSite = (cookieSiteCode && VALID_SITE_CODES.has(cookieSiteCode))
      ? cookieSiteCode
      : DEFAULT_SITE;

    const redirectPath = pathname === "/" ? `/${targetSite}` : `/${targetSite}${pathname}`;
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.cookies.set(SITE_CODE_COOKIE, siteCode, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|api).*)"],
};
