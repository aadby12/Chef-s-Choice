import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type AdminClient = ReturnType<typeof createSupabaseAdminClient>;

async function decrementStockForOrder(admin: AdminClient, orderId: string) {
  const { data: lines } = await admin.from("order_items").select("product_id, quantity").eq("order_id", orderId);
  for (const line of lines ?? []) {
    if (!line.product_id) continue;
    const { data: p } = await admin.from("products").select("stock").eq("id", line.product_id).maybeSingle();
    if (!p) continue;
    const next = Math.max(0, (p.stock ?? 0) - line.quantity);
    await admin.from("products").update({ stock: next }).eq("id", line.product_id);
  }
}

/**
 * Marks order paid and payment row succeeded; decrements product stock once (idempotent if already paid).
 */
export async function completeVerifiedGhsPayment(options: {
  orderId: string;
  paidGhs: number;
  paymentMethod: "card" | "mobile_money";
  paymentMetadata: Record<string, unknown>;
}) {
  const admin = createSupabaseAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select("id, status, total_ghs")
    .eq("id", options.orderId)
    .maybeSingle();

  if (!order) {
    return { ok: false as const, error: "order_not_found" as const };
  }

  if (Math.abs(Number(order.total_ghs) - options.paidGhs) > 0.02) {
    return { ok: false as const, error: "amount_mismatch" as const };
  }

  if (order.status === "paid") {
    return { ok: true as const, alreadyFinalized: true };
  }

  await admin.from("orders").update({ status: "paid" }).eq("id", options.orderId);

  const { data: payment } = await admin
    .from("payments")
    .select("metadata")
    .eq("order_id", options.orderId)
    .eq("method", options.paymentMethod)
    .maybeSingle();

  const mergedMeta = {
    ...((payment?.metadata as Record<string, unknown>) ?? {}),
    ...options.paymentMetadata,
  };

  await admin
    .from("payments")
    .update({ status: "succeeded", metadata: mergedMeta })
    .eq("order_id", options.orderId)
    .eq("method", options.paymentMethod);

  await decrementStockForOrder(admin, options.orderId);

  return { ok: true as const };
}
