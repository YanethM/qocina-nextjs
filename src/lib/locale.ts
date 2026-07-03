import { cookies } from "next/headers";
import { SITE_DEFAULT_LOCALE, VALID_SITE_CODES, type SiteCode } from "@/lib/constants";

function defaultLocaleFor(siteCode?: string): string {
  if (siteCode && (VALID_SITE_CODES as readonly string[]).includes(siteCode)) {
    return SITE_DEFAULT_LOCALE[siteCode as SiteCode];
  }
  return process.env.NEXT_PUBLIC_LOCALE || "es";
}

export async function getLocale(siteCode?: string): Promise<string> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("locale")?.value || defaultLocaleFor(siteCode);
  } catch {
    return defaultLocaleFor(siteCode);
  }
}
