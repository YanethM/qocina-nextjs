import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import CountryModal from "@/components/CountryModal/CountryModal";
import { VALID_SITE_CODES, SITE_CODE_COOKIE } from "@/lib/constants";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const VALID = new Set<string>(VALID_SITE_CODES);

export default async function RootPage() {
  const cookieStore = await cookies();
  const siteCode = cookieStore.get(SITE_CODE_COOKIE)?.value;

  if (siteCode && VALID.has(siteCode)) {
    redirect(`/${siteCode}`);
  }

  return <CountryModal forceVisible />;
}
