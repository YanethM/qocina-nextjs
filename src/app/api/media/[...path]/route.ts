import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/lib/strapi";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;

  if (path[0] !== "uploads" || path.some((segment) => segment === "..")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const upstreamUrl = `${API_URL}/${path.map(encodeURIComponent).join("/")}`;
  const upstreamRes = await fetch(upstreamUrl);

  if (!upstreamRes.ok || !upstreamRes.body) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(upstreamRes.body, {
    status: 200,
    headers: {
      "Content-Type": upstreamRes.headers.get("content-type") ?? "application/octet-stream",
      "Cache-Control": upstreamRes.headers.get("cache-control") ?? "public, max-age=3600",
    },
  });
}
