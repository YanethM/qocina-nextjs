export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://backend.qocinaencasa.com";

export function getStrapiImageUrl(url: string | undefined | null): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `/api/media${url}`;
}

export function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, "");
}
