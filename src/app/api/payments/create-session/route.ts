import { NextRequest, NextResponse } from "next/server";
import { VALID_SITE_CODES } from "@/lib/constants";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://backend.qocinaencasa.com";

const VALID = new Set<string>(VALID_SITE_CODES);

export async function POST(req: NextRequest) {
  try {
    const { siteCode, orderId, gateway } = await req.json();

    if (!siteCode || !VALID.has(siteCode)) {
      return NextResponse.json(
        { error: { message: `siteCode inválido o ausente: "${siteCode}"` } },
        { status: 400 }
      );
    }
    if (!orderId || !gateway) {
      return NextResponse.json(
        { error: { message: "Se requiere orderId y gateway" } },
        { status: 400 }
      );
    }

    const res = await fetch(`${API_URL}/api/payments/create-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Site": siteCode,
      },
      body: JSON.stringify({ orderId, gateway }),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: { message: "Error interno al crear la sesión de pago" } },
      { status: 500 }
    );
  }
}
