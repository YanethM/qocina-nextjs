import { NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await fetch(`${STRAPI_URL}/api/ubigeo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.ok ? 200 : res.status });
  } catch (e) {
    console.error("[Ofix proxy]", e);
    return NextResponse.json({ error: "Error en ubigeo" }, { status: 500 });
  }
}
