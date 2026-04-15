import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const VALID_SITES = new Set(["pe", "us", "es", "mx", "ar", "co", "ec", "cl"]);

export default async function RootPage() {
  const cookieStore = await cookies();
  const siteCode = cookieStore.get("site-code")?.value;
  const target = siteCode && VALID_SITES.has(siteCode) ? siteCode : "pe";
  redirect(`/${target}`);
}
