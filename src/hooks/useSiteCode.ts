"use client";

import { usePathname } from "next/navigation";

const VALID_SITE_CODES = new Set(["pe", "us", "es", "mx", "ar", "co", "ec", "cl"]);

export function useSiteCode(): string {
  const pathname = usePathname();
  const firstSegment = pathname?.split("/")[1] ?? "";
  return VALID_SITE_CODES.has(firstSegment) ? firstSegment : "pe";
}
