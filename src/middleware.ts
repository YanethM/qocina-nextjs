import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  VALID_SITE_CODES,
  SITE_CODE_COOKIE,
  LOCALE_COOKIE,
  SITE_DEFAULT_LOCALE,
  COOKIE_MAX_AGE,
  GEO_HINT_COOKIE,
  GEO_HINT_MAX_AGE,
  CHECKOUT_ENABLED_SITE_CODES,
  GEO_FALLBACK_SITE_CODE,
  type SiteCode,
} from "@/lib/constants";

const VALID = new Set<string>(VALID_SITE_CODES);
const CHECKOUT_ENABLED = new Set<string>(CHECKOUT_ENABLED_SITE_CODES);

async function detectCountryFromIP(request: NextRequest): Promise<SiteCode | null> {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!ip) return null;

  const token = process.env.IPINFO_TOKEN;
  const url = token ? `https://ipinfo.io/${ip}?token=${token}` : `https://ipinfo.io/${ip}/json`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(1500) });
    if (!res.ok) return null;
    const data = await res.json();
    const countryCode = (data.country as string | undefined)?.toLowerCase();
    return countryCode && VALID.has(countryCode) ? (countryCode as SiteCode) : null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1];
  const hasSiteCode = VALID.has(firstSegment);

  if (hasSiteCode) {
    const siteCode = firstSegment as SiteCode;

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-site-code", siteCode);
    requestHeaders.set("x-pathname", pathname);

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

  if (request.cookies.get(GEO_HINT_COOKIE)?.value !== undefined) {
    return NextResponse.next();
  }

  const detected = await detectCountryFromIP(request);
  const secureCookies = process.env.NEXT_PUBLIC_SECURE_COOKIES === "true";

  if (detected) {
    const resolvedSiteCode = CHECKOUT_ENABLED.has(detected) ? detected : GEO_FALLBACK_SITE_CODE;
    const response = NextResponse.redirect(new URL(`/${resolvedSiteCode}`, request.url));

    response.cookies.set(SITE_CODE_COOKIE, resolvedSiteCode, {
      path: "/",
      maxAge: COOKIE_MAX_AGE,
      sameSite: "lax",
      secure: secureCookies,
    });
    response.cookies.set(LOCALE_COOKIE, SITE_DEFAULT_LOCALE[resolvedSiteCode], {
      path: "/",
      maxAge: COOKIE_MAX_AGE,
      sameSite: "lax",
      secure: secureCookies,
    });
    response.cookies.set(GEO_HINT_COOKIE, detected, {
      path: "/",
      maxAge: GEO_HINT_MAX_AGE,
      sameSite: "lax",
      secure: secureCookies,
    });
    return response;
  }

  const response = NextResponse.next();
  response.cookies.set(GEO_HINT_COOKIE, "", {
    path: "/",
    maxAge: GEO_HINT_MAX_AGE,
    sameSite: "lax",
    secure: secureCookies,
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|images|api).*)"],
};
