"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/hooks/use-cart";
import { formatGhs } from "@/lib/utils";
import { shippingGhsForZone } from "@/lib/delivery-pricing";
import type { Product } from "@/types/domain";
import { PLACEHOLDER_PRODUCT } from "@/lib/placeholders";

type PaymentMethod = "card" | "mobile_money" | "cod" | "whatsapp";

type CheckoutZone = {
  id: string;
  name: string;
  slug: string;
  fee_ghs: number;
  free_over_ghs: number | null;
  eta_hours_min: number | null;
  eta_hours_max: number | null;
};

function CheckoutPageInner() {
  const { items, subtotal, addItem, clear } = useCart();
  const sp = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [mmProvider, setMmProvider] = useState<"mock" | "mtn_gh" | "telecel_cash" | "airteltigo_cash">("mock");
  const [zones, setZones] = useState<CheckoutZone[]>([]);
  const [zoneId, setZoneId] = useState<string | null>(null);

  const buySlug = sp.get("buyNow");
  const buyQty = Math.max(1, parseInt(sp.get("qty") || "1", 10));
  const buyOnce = useRef(false);

  useEffect(() => {
    if (!buySlug || buyOnce.current) return;
    buyOnce.current = true;
    let cancelled = false;
    (async () => {
      const res = await fetch(`/api/products/by-slug?slug=${encodeURIComponent(buySlug)}`);
      if (!res.ok || cancelled) return;
      const p = (await res.json()) as Product;
      if (cancelled) return;
      addItem(
        {
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          sku: p.sku,
          stock: p.stock,
          image: p.product_images?.[0]?.url ?? PLACEHOLDER_PRODUCT,
        },
        buyQty
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [buySlug, buyQty, addItem]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/delivery-zones");
        const data = (await res.json()) as { zones?: CheckoutZone[] };
        if (cancelled) return;
        const list = data.zones ?? [];
        setZones(list);
        if (list.length > 0) {
          setZoneId((prev) => prev ?? list[0].id);
        }
      } catch {
        if (!cancelled) setZones([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const lines = useMemo(() => items, [items]);

  const selectedZone = useMemo(() => zones.find((z) => z.id === zoneId) ?? null, [zones, zoneId]);
  const shipping = useMemo(() => shippingGhsForZone(subtotal, selectedZone), [subtotal, selectedZone]);
  const orderTotal = subtotal + shipping;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (lines.length === 0) {
      setError("Your bag is empty.");
      return;
    }
    if (zones.length > 0 && !zoneId) {
      setError("Choose a delivery area.");
      return;
    }
    const fd = new FormData(e.currentTarget);
    const payment = paymentMethod;
    setSubmitting(true);
    try {
      const payload = {
        email: String(fd.get("email")),
        phone: String(fd.get("phone")),
        fullName: String(fd.get("fullName")),
        line1: String(fd.get("line1")),
        line2: String(fd.get("line2") || ""),
        city: String(fd.get("city") || "Accra"),
        notes: String(fd.get("notes") || ""),
        payment,
        ...(zones.length > 0 && zoneId ? { deliveryZoneId: zoneId } : {}),
        ...(payment === "mobile_money" ? { mobileMoneyProvider: mmProvider } : {}),
        items: lines.map((l) => ({
          productId: l.product.id,
          name: l.product.name,
          sku: l.product.sku,
          unitPriceGhs: l.product.price,
          qty: l.qty,
        })),
      };
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (data.url) {
        window.location.href = data.url as string;
        return;
      }
      if (data.redirect) {
        clear();
        window.location.href = data.redirect as string;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container className="pb-20">
      <h1 className="font-display text-3xl text-brand-espresso">Checkout</h1>
      <p className="mt-2 text-sm text-brand-espresso/65">Secure payments · Paystack (card & channels) · Mobile Money · COD · WhatsApp assist.</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-brand-espresso/10 bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" name="fullName" required autoComplete="name" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" required autoComplete="tel" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="line1">Address line 1</Label>
              <Input id="line1" name="line1" required />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="line2">Address line 2</Label>
              <Input id="line2" name="line2" />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" defaultValue="Accra" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="notes">Order notes</Label>
              <Input id="notes" name="notes" placeholder="Gate code, delivery hints…" />
            </div>
          </div>

          {zones.length > 0 && (
            <fieldset>
              <legend className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-espresso/45">Delivery area</legend>
              <p className="mt-2 text-xs text-brand-espresso/55">Sets your shipping fee and ETA (free over threshold when configured).</p>
              <div className="mt-3">
                <Label htmlFor="deliveryZone">Zone</Label>
                <select
                  id="deliveryZone"
                  value={zoneId ?? ""}
                  onChange={(e) => setZoneId(e.target.value || null)}
                  className="mt-1 min-h-11 w-full rounded-xl border border-brand-espresso/10 bg-white px-4 text-sm shadow-sm focus:border-brand-clay focus:outline-none focus:ring-2 focus:ring-brand-clay/25"
                >
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} · {formatGhs(Number(z.fee_ghs))}
                      {z.free_over_ghs != null ? ` · free over ${formatGhs(Number(z.free_over_ghs))}` : ""}
                    </option>
                  ))}
                </select>
                {selectedZone && selectedZone.eta_hours_min != null && selectedZone.eta_hours_max != null && (
                  <p className="mt-2 text-xs text-brand-espresso/50">
                    Typical dispatch window: {selectedZone.eta_hours_min}–{selectedZone.eta_hours_max}h
                  </p>
                )}
              </div>
            </fieldset>
          )}

          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-espresso/45">Payment</legend>
            <div className="mt-3 space-y-2 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />
                Card / Paystack
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="mobile_money"
                  checked={paymentMethod === "mobile_money"}
                  onChange={() => setPaymentMethod("mobile_money")}
                />
                Mobile Money (mock in dev — see <code className="text-xs">MOBILE_MONEY_MOCK</code>)
              </label>
              {paymentMethod === "mobile_money" && (
                <div className="ml-6 mt-2">
                  <Label htmlFor="mmProvider" className="text-brand-espresso/70">
                    Provider
                  </Label>
                  <select
                    id="mmProvider"
                    value={mmProvider}
                    onChange={(e) => setMmProvider(e.target.value as typeof mmProvider)}
                    className="mt-1 min-h-11 w-full max-w-xs rounded-xl border border-brand-espresso/10 bg-white px-4 text-sm shadow-sm focus:border-brand-clay focus:outline-none focus:ring-2 focus:ring-brand-clay/25"
                  >
                    <option value="mock">Mock (local testing)</option>
                    <option value="mtn_gh">MTN Ghana</option>
                    <option value="telecel_cash">Telecel Cash</option>
                    <option value="airteltigo_cash">AirtelTigo Cash</option>
                  </select>
                </div>
              )}
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                Cash on delivery
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="whatsapp"
                  checked={paymentMethod === "whatsapp"}
                  onChange={() => setPaymentMethod("whatsapp")}
                />
                WhatsApp-assisted
              </label>
            </div>
          </fieldset>

          <label className="flex items-start gap-2 text-xs text-brand-espresso/70">
            <input type="checkbox" required className="mt-0.5 h-4 w-4 rounded" />
            I agree to the order terms, delivery timelines, and returns policy.
          </label>

          {error && <p className="text-sm text-brand-terracotta">{error}</p>}
          {sp.get("cancelled") === "1" && (
            <p className="text-sm text-brand-terracotta">Card checkout was cancelled — your bag is still here.</p>
          )}

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
            {submitting ? "Processing…" : "Place order"}
          </Button>
        </form>

        <aside className="rounded-2xl border border-brand-espresso/10 bg-brand-mist/40 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-espresso/45">Order summary</p>
          <ul className="mt-4 space-y-3 text-sm">
            {lines.map((l) => (
              <li key={l.product.id} className="flex justify-between gap-4">
                <span className="text-brand-espresso/80">
                  {l.product.name} × {l.qty}
                </span>
                <span className="font-medium">{formatGhs(l.product.price * l.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 space-y-2 border-t border-brand-espresso/10 pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-brand-espresso/75">Subtotal</span>
              <span className="font-medium">{formatGhs(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-espresso/75">Shipping</span>
              <span className="font-medium">{zones.length > 0 ? formatGhs(shipping) : formatGhs(0)}</span>
            </div>
            <div className="flex justify-between border-t border-brand-espresso/10 pt-3 text-base font-semibold">
              <span>Total</span>
              <span>{formatGhs(zones.length > 0 ? orderTotal : subtotal)}</span>
            </div>
          </div>
          {zones.length === 0 && (
            <p className="mt-2 text-xs text-brand-espresso/55">
              No delivery zones in the database yet — shipping is {formatGhs(0)} (add zones in Supabase or run seed).
            </p>
          )}
          <Link href="/cart" className="mt-6 inline-block text-sm font-medium text-brand-terracotta hover:underline">
            Edit bag
          </Link>
        </aside>
      </div>
    </Container>
  );
}

function CheckoutFallback() {
  return (
    <Container className="pb-20">
      <h1 className="font-display text-3xl text-brand-espresso">Checkout</h1>
      <p className="mt-2 text-sm text-brand-espresso/65">Loading checkout…</p>
    </Container>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutPageInner />
    </Suspense>
  );
}
