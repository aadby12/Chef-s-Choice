import { NextResponse } from "next/server";
import { z } from "zod";
import { getMobileMoneyAdapter } from "@/lib/payments/mobile-money-service";
import type { MobileMoneyProviderId } from "@/lib/payments/types";

const initiateSchema = z.object({
  orderId: z.string().uuid(),
  phone: z.string().min(8),
  amountGhs: z.number().positive(),
  provider: z.custom<MobileMoneyProviderId>((v) => typeof v === "string"),
  idempotencyKey: z.string().min(8),
});

export async function POST(req: Request) {
  let body: z.infer<typeof initiateSchema>;
  try {
    body = initiateSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const adapter = getMobileMoneyAdapter(body.provider);
  const res = await adapter.initiatePayment({
    orderId: body.orderId,
    phone: body.phone,
    amountGhs: body.amountGhs,
    provider: body.provider,
    idempotencyKey: body.idempotencyKey,
  });

  if (!res.success) {
    return NextResponse.json({ error: res.message ?? "Failed" }, { status: 400 });
  }

  return NextResponse.json({ reference: res.reference, message: res.message });
}
