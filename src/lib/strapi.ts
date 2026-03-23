export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://ec2-23-23-186-243.compute-1.amazonaws.com:1337";

export function getStrapiImageUrl(url: string | undefined | null): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_URL}${url}`;
}
