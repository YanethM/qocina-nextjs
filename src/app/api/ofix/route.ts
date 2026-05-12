import { NextResponse } from "next/server";

const OFIX_BASE = process.env.OFIX_API_BASE_URL ?? "";
const OFIX_USER = process.env.OFIX_USER ?? "";
const OFIX_PASSWORD = process.env.OFIX_PASSWORD ?? "";
const OFIX_API_KEY = process.env.OFIX_API_KEY ?? "";

async function getToken(): Promise<string> {
  const res = await fetch(`${OFIX_BASE}/db/Security/GetToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user: OFIX_USER, password: OFIX_PASSWORD, key: OFIX_API_KEY }),
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) {
    throw new Error(`Ofix token failed: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  if (!data?.token?.key) {
    throw new Error(`Ofix token response inesperado: ${JSON.stringify(data)}`);
  }
  return data.token.key;
}

const ACTION_PATH: Record<string, string> = {
  getNiveles: "/External/Maestro/GetNivelesUbigeo",
  getNivel1: "/External/Maestro/GetUbigeoDepartament",
  getNivel1US: "/External/maestro/GetUbigeoDepartaments",
  getNivel2: "/External/Maestro/GetUbigeoCity",
  getNivel3: "/External/Maestro/GetUbigeoDistrict",
};

export async function POST(req: Request) {
  try {
    const { action, ...params } = await req.json();

    const resolvedAction =
      action === "getNivel1" && params.countryCode === "US" ? "getNivel1US" : action;

    const path = ACTION_PATH[resolvedAction];
    if (!path) {
      return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
    }

    const token = await getToken();

    const res = await fetch(`${OFIX_BASE}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
      signal: AbortSignal.timeout(10000),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.ok ? 200 : res.status });
  } catch (e) {
    console.error("[Ofix proxy]", e);
    return NextResponse.json({ error: "Error en ubigeo" }, { status: 500 });
  }
}
