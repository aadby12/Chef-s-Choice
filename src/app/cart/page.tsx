"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/hooks/use-cart";
import { formatGhs } from "@/lib/utils";
import { Container } from "@/components/layout/container";
import { PLACEHOLDER_PRODUCT } from "@/lib/placeholders";

export default function CartPage() {
  const { items, setQty, removeItem, subtotal, clear } = useCart();

  return (
    <Container className="pb-14">
      <h1 className="font-display text-3xl text-brand-espresso sm:text-4xl">Your bag</h1>
      <p className="mt-2 text-sm text-brand-espresso/65">Review pieces before a calm, secure checkout.</p>

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-brand-espresso/10 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-brand-espresso/70">Your bag is ready for something beautiful.</p>
          <Link
            href="/shop"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-brand-espresso px-8 text-sm font-semibold text-brand-cream hover:bg-brand-charcoal"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mt-7 grid gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="space-y-4 lg:col-span-2">
            {items.map((line) => (
              <div
                key={line.product.id}
                className="flex gap-4 rounded-2xl border border-brand-espresso/10 bg-white p-4 shadow-sm"
              >
                <Link href={`/products/${line.product.slug}`} className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-brand-sand/30">
                  <Image
                    src={line.product.image || PLACEHOLDER_PRODUCT}
                    alt={line.product.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-4">
                    <div>
                      <Link href={`/products/${line.product.slug}`} className="font-medium text-brand-espresso hover:underline">
                        {line.product.name}
                      </Link>
                      <p className="mt-1 text-xs text-brand-espresso/50">SKU {line.product.sku}</p>
                    </div>
                    <p className="text-sm font-semibold text-brand-espresso">{formatGhs(line.product.price * line.qty)}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-espresso/15 bg-white"
                        onClick={() => setQty(line.product.id, line.qty - 1)}
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm">{line.qty}</span>
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-espresso/15 bg-white"
                        onClick={() => setQty(line.product.id, line.qty + 1)}
                        aria-label="Increase"
                      >
                        +
                      </button>
                    </div>
                    <button type="button" className="text-xs font-semibold text-brand-terracotta hover:underline" onClick={() => removeItem(line.product.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button type="button" className="text-xs font-medium text-brand-espresso/50 hover:text-brand-espresso" onClick={clear}>
              Clear bag
            </button>
          </div>
          <aside className="rounded-2xl border border-brand-espresso/10 bg-white p-6 shadow-sm lg:sticky lg:top-8 lg:self-start">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-espresso/45">Summary</p>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-brand-espresso/70">Subtotal</span>
              <span className="font-semibold text-brand-espresso">{formatGhs(subtotal)}</span>
            </div>
            <p className="mt-2 text-xs text-brand-espresso/55">Shipping & promotions calculated at checkout.</p>
            <Link
              href="/checkout"
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brand-espresso text-sm font-semibold text-brand-cream hover:bg-brand-charcoal"
            >
              Checkout
            </Link>
            <Link href="/shop" className="mt-3 block text-center text-xs font-medium text-brand-terracotta hover:underline">
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </Container>
  );
}
