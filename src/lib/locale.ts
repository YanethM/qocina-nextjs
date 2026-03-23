import { cookies } from "next/headers";

export async function getLocale(): Promise<string> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("locale")?.value || process.env.NEXT_PUBLIC_LOCALE || "es";
  } catch {
    return process.env.NEXT_PUBLIC_LOCALE || "es";
  }
}
