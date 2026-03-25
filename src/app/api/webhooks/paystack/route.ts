import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { isValidPaystackWebhookSignature } from "@/lib/payments/paystack-server";
import { finalizePaystackOrderIfNeeded } from "@/lib/payments/paystack-order";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = (await headers()).get("x-paystack-signature");

  if (!isValidPaystackWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let payload: { event?: string; data?: { reference?: string; metadata?: { order_id?: string } } };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (payload.event === "charge.success" && payload.data?.reference) {
    await finalizePaystackOrderIfNeeded(payload.data.reference, payload.data.metadata?.order_id ?? null);
  }

  return NextResponse.json({ received: true });
}
