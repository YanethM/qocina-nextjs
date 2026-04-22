"use client";

import { usePathname } from "next/navigation";
import { VALID_SITE_CODES, SITE_CODE_COOKIE, type SiteCode } from "@/lib/constants";

const VALID = new Set<string>(VALID_SITE_CODES);

export function useSiteCode(): SiteCode | "" {
  const pathname = usePathname();
  const firstSegment = pathname?.split("/")[1] ?? "";
  if (VALID.has(firstSegment)) return firstSegment as SiteCode;

  if (typeof document !== "undefined") {
    const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${SITE_CODE_COOKIE}=([^;]+)`));
    const fromCookie = match?.[1] ?? "";
    if (VALID.has(fromCookie)) return fromCookie as SiteCode;
  }

  return "";
}
