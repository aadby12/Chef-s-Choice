import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { paystackInitializeTransaction } from "@/lib/payments/paystack-server";
import { getMobileMoneyAdapter } from "@/lib/payments/mobile-money-service";
import type { MobileMoneyProviderId } from "@/lib/payments/types";
import { shippingGhsForZone } from "@/lib/delivery-pricing";

const itemSchema = z.object({
  productId: z.string().uuid(),
  name: z.string(),
  sku: z.string(),
  unitPriceGhs: z.number().positive(),
  qty: z.number().int().positive(),
});

const bodySchema = z.object({
  email: z.string().email(),
  phone: z.string().min(6),
  fullName: z.string().min(2),
  line1: z.string().min(2),
  line2: z.string().optional(),
  city: z.string().default("Accra"),
  notes: z.string().optional(),
  payment: z.enum(["card", "mobile_money", "cod", "whatsapp"]),
  items: z.array(itemSchema).min(1),
  deliveryZoneId: z.string().uuid().optional(),
  couponCode: z.string().optional(),
  mobileMoneyProvider: z.enum(["mtn_gh", "telecel_cash", "airteltigo_cash", "mock"]).optional(),
});

export async function POST(req: Request) {
  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const supabaseAdmin = createSupabaseAdminClient();

  for (const item of body.items) {
    const { data: product, error: pErr } = await supabaseAdmin
      .from("products")
      .select("id, stock, price")
      .eq("id", item.productId)
      .maybeSingle();
    if (pErr || !product) {
      return NextResponse.json({ error: "A product in your bag is no longer available." }, { status: 400 });
    }
    if (product.stock < item.qty) {
      return NextResponse.json({ error: `Not enough stock for one of the items (SKU line).` }, { status: 400 });
    }
    if (Math.abs(Number(product.price) - item.unitPriceGhs) > 0.02) {
      return NextResponse.json({ error: "A price changed — refresh the shop and try again." }, { status: 409 });
    }
  }

  let userId: string | null = null;
  try {
    const supabaseAuth = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabaseAuth.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    /* env/cookies unavailable — guest checkout */
  }

  const subtotal = body.items.reduce((s, i) => s + i.unitPriceGhs * i.qty, 0);
  const discount = 0;

  const { count: activeZoneCount } = await supabaseAdmin
    .from("delivery_zones")
    .select("id", { count: "exact", head: true })
    .eq("active", true);

  const zonesConfigured = (activeZoneCount ?? 0) > 0;
  if (zonesConfigured && !body.deliveryZoneId) {
    return NextResponse.json({ error: "Please choose a delivery area." }, { status: 400 });
  }

  let shipping = 0;
  if (body.deliveryZoneId) {
    const { data: zone, error: zErr } = await supabaseAdmin
      .from("delivery_zones")
      .select("fee_ghs, free_over_ghs, active")
      .eq("id", body.deliveryZoneId)
      .maybeSingle();
    if (zErr || !zone || !zone.active) {
      return NextResponse.json({ error: "Invalid delivery area." }, { status: 400 });
    }
    shipping = shippingGhsForZone(subtotal, zone);
  }

  const total = subtotal + shipping - discount;

  const { data: order, error: orderErr } = await supabaseAdmin
    .from("orders")
    .insert({
      user_id: userId,
      email: body.email,
      phone: body.phone,
      status: "pending",
      subtotal_ghs: subtotal,
      shipping_ghs: shipping,
      tax_ghs: 0,
      discount_ghs: discount,
      total_ghs: total,
      delivery_zone_id: body.deliveryZoneId ?? null,
      shipping_address: {
        fullName: body.fullName,
        line1: body.line1,
        line2: body.line2,
        city: body.city,
      },
      notes: body.notes ?? null,
    })
    .select("id")
    .single();

  if (orderErr || !order) {
    return NextResponse.json({ error: "Could not create order" }, { status: 500 });
  }

  const orderItems = body.items.map((i) => ({
    order_id: order.id,
    product_id: i.productId,
    name_snapshot: i.name,
    sku_snapshot: i.sku,
    unit_price_ghs: i.unitPriceGhs,
    quantity: i.qty,
  }));

  const { error: itemsErr } = await supabaseAdmin.from("order_items").insert(orderItems);
  if (itemsErr) {
    await supabaseAdmin.from("orders").delete().eq("id", order.id);
    return NextResponse.json({ error: "Could not save line items" }, { status: 500 });
  }

  if (body.payment === "card") {
    try {
      const origin = req.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
      const reference = order.id.replace(/-/g, "");

      const { authorizationUrl, reference: paystackRef } = await paystackInitializeTransaction({
        email: body.email,
        amountGhs: total,
        reference,
        callbackUrl: `${origin}/confirmation?orderId=${order.id}`,
        metadata: {
          order_id: String(order.id),
          cart: body.items.map((i) => i.name).join(", ").slice(0, 200),
        },
      });

      await supabaseAdmin.from("payments").insert({
        order_id: order.id,
        provider: "paystack",
        method: "card",
        status: "pending",
        amount_ghs: total,
        metadata: { paystack_reference: paystackRef },
      });

      return NextResponse.json({ url: authorizationUrl });
    } catch (e) {
      await supabaseAdmin.from("orders").delete().eq("id", order.id);
      const message = e instanceof Error ? e.message : "Paystack error";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  await supabaseAdmin.from("payments").insert({
    order_id: order.id,
    provider: body.payment === "mobile_money" ? "mobile_money" : "internal",
    method: body.payment,
    status: "pending",
    amount_ghs: total,
    metadata: {},
  });

  if (body.payment === "mobile_money") {
    const provider = (body.mobileMoneyProvider ?? "mock") as MobileMoneyProviderId;
    const adapter = getMobileMoneyAdapter(provider);
    const mm = await adapter.initiatePayment({
      orderId: order.id,
      phone: body.phone,
      amountGhs: total,
      provider,
      idempotencyKey: order.id,
    });

    if (!mm.success || !mm.reference) {
      await supabaseAdmin.from("orders").delete().eq("id", order.id);
      return NextResponse.json({ error: mm.message ?? "Mobile money could not start" }, { status: 400 });
    }

    await supabaseAdmin
      .from("payments")
      .update({
        metadata: { mm_provider: provider, mm_reference: mm.reference },
      })
      .eq("order_id", order.id)
      .eq("method", "mobile_money");

    const refQ = encodeURIComponent(mm.reference);
    return NextResponse.json({
      orderId: order.id,
      totalGhs: total,
      redirect: `/confirmation?orderId=${order.id}&reference=${refQ}`,
    });
  }

  return NextResponse.json({
    orderId: order.id,
    totalGhs: total,
    redirect: `/confirmation?orderId=${order.id}`,
  });
}
