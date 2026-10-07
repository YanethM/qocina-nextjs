import { NextRequest, NextResponse } from "next/server";
import { VALID_SITE_CODES } from "@/lib/constants";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://backend.qocinaencasa.com";

const VALID = new Set<string>(VALID_SITE_CODES);

export async function GET(req: NextRequest) {
  const siteCode = req.nextUrl.searchParams.get("siteCode") ?? "";

  if (!siteCode || !VALID.has(siteCode)) {
    return NextResponse.json(
      { error: { message: `siteCode inválido o ausente: "${siteCode}"` } },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`${API_URL}/api/payment-gateways`, {
      headers: { "X-Site": siteCode },
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: { message: "Error interno al obtener las pasarelas de pago" } },
      { status: 500 }
    );
  }
}
