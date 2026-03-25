import { NextResponse } from "next/server";

/**
 * Provider callback landing — verify reference, update `payments` via service role.
 * Each PSP will differ; keep logic in adapters + this route thin.
 */
export async function POST(req: Request) {
  const payload = await req.json().catch(() => ({}));
  console.info("[mobile-money callback]", payload);
  return NextResponse.json({ ok: true });
}
