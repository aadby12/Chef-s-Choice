import { paystackVerifyTransaction } from "./paystack-server";
import { completeVerifiedGhsPayment } from "./order-payment";

/**
 * Idempotent: verifies with Paystack, then marks order + card payment succeeded if still pending.
 */
export async function finalizePaystackOrderIfNeeded(reference: string, orderIdHint: string | null) {
  const verified = await paystackVerifyTransaction(reference);
  if (!verified.success || !verified.data || verified.data.status !== "success") {
    return { ok: false as const, error: "verification_failed" as const };
  }

  const data = verified.data;
  const meta = (data.metadata ?? {}) as Record<string, unknown>;
  const orderId = (meta.order_id != null ? String(meta.order_id) : null) || orderIdHint;
  if (!orderId) {
    return { ok: false as const, error: "no_order_id" as const };
  }

  const paidGhs = data.amount / 100;

  return completeVerifiedGhsPayment({
    orderId,
    paidGhs,
    paymentMethod: "card",
    paymentMetadata: {
      paystack_reference: reference,
      paystack_transaction_id: data.id,
    },
  });
}
