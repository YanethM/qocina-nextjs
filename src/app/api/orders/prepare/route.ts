import { NextRequest, NextResponse } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://ec2-23-23-186-243.compute-1.amazonaws.com:1337";

const SITE_CODE = process.env.NEXT_PUBLIC_SITE_CODE || "pe";

export async function POST(req: NextRequest) {
  try {
    const { siteCode: _ignored, ...body } = await req.json();

    console.log("[prepare] body enviado al backend:", JSON.stringify(body, null, 2));
    const res = await fetch(`${API_URL}/api/orders/prepare`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Site": SITE_CODE,
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
