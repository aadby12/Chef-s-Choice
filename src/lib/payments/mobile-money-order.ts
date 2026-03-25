import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getMobileMoneyAdapter } from "./mobile-money-service";
import type { MobileMoneyProviderId } from "./types";
import { completeVerifiedGhsPayment } from "./order-payment";

/**
 * Confirms mock / provider mobile-money reference and finalizes the order (same as Paystack success path).
 */
export async function finalizeMobileMoneyOrderIfNeeded(reference: string, orderIdHint: string | null) {
  if (!orderIdHint) {
    return { ok: false as const, error: "no_order_id" as const };
  }

  const admin = createSupabaseAdminClient();
  const { data: pay } = await admin
    .from("payments")
    .select("metadata")
    .eq("order_id", orderIdHint)
    .eq("method", "mobile_money")
    .maybeSingle();

  const meta = (pay?.metadata ?? {}) as Record<string, unknown>;
  const provider = (meta.mm_provider as MobileMoneyProviderId | undefined) ?? "mock";

  const adapter = getMobileMoneyAdapter(provider);
  const verified = await adapter.verifyPayment({ reference, provider });
  if (!verified.success || verified.status !== "succeeded") {
    return { ok: false as const, error: "verification_failed" as const };
  }

  const { data: order } = await admin.from("orders").select("total_ghs").eq("id", orderIdHint).maybeSingle();
  if (!order) {
    return { ok: false as const, error: "order_not_found" as const };
  }

  return completeVerifiedGhsPayment({
    orderId: orderIdHint,
    paidGhs: Number(order.total_ghs),
    paymentMethod: "mobile_money",
    paymentMetadata: {
      mm_reference: reference,
      mm_provider: provider,
    },
  });
}
