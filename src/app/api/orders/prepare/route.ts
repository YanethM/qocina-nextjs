import { NextRequest, NextResponse } from "next/server";
import { VALID_SITE_CODES } from "@/lib/constants";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://ec2-23-23-186-243.compute-1.amazonaws.com:1337";

const VALID = new Set<string>(VALID_SITE_CODES);

export async function POST(req: NextRequest) {
  try {
    const { siteCode, ...body } = await req.json();

    if (!siteCode || !VALID.has(siteCode)) {
      return NextResponse.json(
        { error: { message: `siteCode inválido o ausente: "${siteCode}"` } },
        { status: 400 }
      );
    }

    console.log("[prepare] siteCode:", siteCode, "body:", JSON.stringify(body, null, 2));

    const res = await fetch(`${API_URL}/api/orders/prepare`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Site": siteCode,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: { message: "Error interno al preparar la orden" } },
      { status: 500 }
    );
  }
}
