import { NextResponse } from "next/server";
import { getSites } from "@/lib/api";

export async function GET() {
  try {
    const res = await getSites();
    return NextResponse.json(res.data ?? []);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
