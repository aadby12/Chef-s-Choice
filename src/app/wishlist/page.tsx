"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import { Container } from "@/components/layout/container";
import { useWishlist } from "@/lib/hooks/use-wishlist";
import type { Product } from "@/types/domain";
import { Skeleton } from "@/components/ui/skeleton";

export default function WishlistPage() {
  const { ids } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const idList = [...ids];
    if (idList.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const results = await Promise.all(
        idList.map(async (id) => {
          const res = await fetch(`/api/products/by-id?id=${encodeURIComponent(id)}`);
          if (!res.ok) return null;
          return (await res.json()) as Product;
        })
      );
      if (!cancelled) {
        setProducts(results.filter(Boolean) as Product[]);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ids]);

  return (
    <Container className="pb-20">
      <h1 className="font-display text-3xl text-brand-espresso">Wishlist</h1>
      <p className="mt-2 text-sm text-brand-espresso/65">Curated pieces you’re considering — syncs on this device.</p>
      {loading ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="mt-12 text-sm text-brand-espresso/60">Save pieces from product pages — they’ll appear here.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </Container>
  );
}
