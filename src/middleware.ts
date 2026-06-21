import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  VALID_SITE_CODES,
  SITE_CODE_COOKIE,
  LOCALE_COOKIE,
  SITE_DEFAULT_LOCALE,
  COOKIE_MAX_AGE,
  type SiteCode,
} from "@/lib/constants";

const VALID = new Set<string>(VALID_SITE_CODES);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1];
  const hasSiteCode = VALID.has(firstSegment);

  if (hasSiteCode) {
    const siteCode = firstSegment as SiteCode;

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-site-code", siteCode);

    const response = NextResponse.next({ request: { headers: requestHeaders } });

    const secureCookies = process.env.NEXT_PUBLIC_SECURE_COOKIES === "true";

    response.cookies.set(SITE_CODE_COOKIE, siteCode, {
      path: "/",
      maxAge: COOKIE_MAX_AGE,
      sameSite: "lax",
      secure: secureCookies,
    });

    const existingLocale = request.cookies.get(LOCALE_COOKIE)?.value;
    if (!existingLocale) {
      response.cookies.set(LOCALE_COOKIE, SITE_DEFAULT_LOCALE[siteCode], {
        path: "/",
        maxAge: COOKIE_MAX_AGE,
        sameSite: "lax",
        secure: secureCookies,
      });
    }

    return response;
  }

  const cookieSiteCode = request.cookies.get(SITE_CODE_COOKIE)?.value;

  if (cookieSiteCode && VALID.has(cookieSiteCode)) {
    const redirectPath =
      pathname === "/" ? `/${cookieSiteCode}` : `/${cookieSiteCode}${pathname}`;
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  if (pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|images|api).*)"],
};
