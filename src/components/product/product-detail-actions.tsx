"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/types/domain";
import { BRAND } from "@/lib/brand";
import { formatGhs } from "@/lib/utils";
import { useCart } from "@/lib/hooks/use-cart";
import { useWishlist } from "@/lib/hooks/use-wishlist";
import { Button } from "@/components/ui/button";
import { PLACEHOLDER_PRODUCT } from "@/lib/placeholders";

export function ProductDetailActions({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toggle, has } = useWishlist();
  const [qty, setQty] = useState(1);
  const img = product.product_images?.[0]?.url ?? PLACEHOLDER_PRODUCT;
  const waText = encodeURIComponent(
    `Hi ${BRAND.name} — I'm interested in ${product.name} (${product.sku}). Can you help with availability?`
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-espresso/45">{product.categories?.name}</p>
        <h1 className="mt-2 font-display text-3xl text-brand-espresso sm:text-4xl">{product.name}</h1>
        {product.short_description && (
          <p className="mt-3 text-sm leading-relaxed text-brand-espresso/75">{product.short_description}</p>
        )}
        <div className="mt-5 flex flex-wrap items-baseline gap-3">
          <span className="text-2xl font-semibold text-brand-espresso">{formatGhs(product.price)}</span>
          {product.compare_at_price != null && product.compare_at_price > product.price && (
            <span className="text-lg text-brand-espresso/40 line-through">{formatGhs(product.compare_at_price)}</span>
          )}
        </div>
        <p className="mt-3 text-xs text-brand-espresso/55">
          SKU {product.sku} · {product.stock > 0 ? <span className="text-brand-sage font-medium">In stock</span> : <span className="text-brand-terracotta font-medium">Out of stock</span>}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="text-xs font-semibold uppercase tracking-wide text-brand-espresso/55" htmlFor="qty">
          Quantity
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-espresso/15 bg-white text-lg"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <input
            id="qty"
            className="h-11 w-14 rounded-xl border border-brand-espresso/10 text-center text-sm"
            value={qty}
            onChange={(e) => setQty(Math.max(1, Math.min(product.stock || 99, parseInt(e.target.value || "1", 10))))}
            inputMode="numeric"
          />
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-espresso/15 bg-white text-lg"
            onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          variant="primary"
          size="lg"
          className="flex-1"
          disabled={product.stock <= 0}
          onClick={() =>
            addItem(
              {
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                sku: product.sku,
                stock: product.stock,
                image: img,
              },
              qty
            )
          }
        >
          Add to cart
        </Button>
        <Link
          href={`/checkout?buyNow=${product.slug}&qty=${qty}`}
          className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full border border-brand-espresso/15 bg-brand-cream px-8 text-base font-medium text-brand-espresso hover:bg-white"
        >
          Buy now
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="ghost" size="sm" onClick={() => toggle(product.id)}>
          {has(product.id) ? "Saved to wishlist" : "Add to wishlist"}
        </Button>
        <a
          href={`https://wa.me/${BRAND.whatsappE164}?text=${waText}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-9 items-center rounded-full border border-brand-sage/40 px-4 text-sm font-medium text-brand-sage hover:bg-brand-mist/80"
        >
          WhatsApp order
        </a>
      </div>

      <ul className="rounded-2xl border border-brand-espresso/10 bg-white p-4 text-xs text-brand-espresso/65">
        <li>24–48h dispatch across Accra · premium packaging</li>
        <li className="mt-2">Need a material comparison? Message us on WhatsApp.</li>
      </ul>
    </div>
  );
}
