"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/domain";
import { formatGhs } from "@/lib/utils";
import { useWishlist } from "@/lib/hooks/use-wishlist";
import { useCart } from "@/lib/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { PLACEHOLDER_PRODUCT } from "@/lib/placeholders";

export function ProductCard({ product }: { product: Product }) {
  const { toggle, has } = useWishlist();
  const { addItem } = useCart();
  const img = product.product_images?.[0]?.url ?? PLACEHOLDER_PRODUCT;
  const categorySlug = product.categories?.slug;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-espresso/10 bg-white/90 shadow-sm ring-1 ring-brand-espresso/[0.06] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-brand-gold/35 hover:shadow-lift">
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-brand-sand/30">
        <Image
          src={img}
          alt={product.product_images?.[0]?.alt ?? product.name}
          fill
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          priority={false}
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {product.best_seller && (
            <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-espresso">
              Best seller
            </span>
          )}
          {product.featured && (
            <span className="rounded-full bg-brand-espresso px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-cream">
              Featured
            </span>
          )}
        </div>
        <button
          type="button"
          className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-espresso/10 bg-white/95 text-brand-espresso shadow-sm backdrop-blur transition hover:border-brand-gold/45"
          aria-label={has(product.id) ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
          }}
        >
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill={has(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
            <path d="M12 20.2c-5.8-3.5-9-6.5-9-10a5.2 5.2 0 0 1 9-3.5 5.2 5.2 0 0 1 9 3.5c0 3.5-3.2 6.5-9 10Z" />
          </svg>
        </button>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        {categorySlug && (
          <Link
            href={`/categories/${categorySlug}`}
            className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-espresso/45 hover:text-brand-espresso"
          >
            {product.categories?.name}
          </Link>
        )}
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-1 font-display text-lg leading-snug text-brand-espresso">{product.name}</h3>
        </Link>
        {product.short_description && (
          <p className="mt-2 line-clamp-2 text-sm text-brand-espresso/65">{product.short_description}</p>
        )}
        <div className="mt-auto flex items-baseline gap-2 pt-4">
          <span className="text-base font-semibold text-brand-espresso">{formatGhs(product.price)}</span>
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="text-sm text-brand-espresso/40 line-through">
              {formatGhs(product.compare_at_price)}
            </span>
          )}
        </div>
        <div className="mt-3 flex gap-2">
          <Button
            type="button"
            variant="primary"
            size="sm"
            className="flex-1"
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
                1
              )
            }
            disabled={product.stock <= 0}
          >
            Add to bag
          </Button>
          <Link
            href={`/checkout?buyNow=${product.slug}&qty=1`}
            className="inline-flex min-h-10 flex-1 items-center justify-center rounded-full border border-brand-espresso/15 bg-brand-cream px-4 text-sm font-medium text-brand-espresso transition hover:bg-white"
          >
            Buy now
          </Link>
        </div>
      </div>
    </article>
  );
}
