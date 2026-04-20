"use client";

import { usePathname } from "next/navigation";
import { VALID_SITE_CODES, type SiteCode } from "@/lib/constants";

const VALID = new Set<string>(VALID_SITE_CODES);

/** Devuelve el siteCode del path actual o "" si no hay ninguno.
 *  Nunca asume un país por defecto. */
export function useSiteCode(): SiteCode | "" {
  const pathname = usePathname();
  const firstSegment = pathname?.split("/")[1] ?? "";
  return VALID.has(firstSegment) ? (firstSegment as SiteCode) : "";
}
