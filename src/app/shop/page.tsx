import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductCard } from "@/components/product/product-card";
import { Container } from "@/components/layout/container";
import { ShopFilters } from "@/components/shop/shop-filters";
import { getCategories, getProducts } from "@/lib/data/catalog";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Shop all cookware",
  description: "Browse premium cookware and kitchen essentials — filter by material, price, and availability.",
};

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

function parseParams(sp: SearchParams) {
  const g = (k: string) => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const q = g("q");
  const category = g("category");
  const material = g("material");
  const minPrice = g("minPrice") ? Number(g("minPrice")) : undefined;
  const maxPrice = g("maxPrice") ? Number(g("maxPrice")) : undefined;
  const inStock = g("inStock") === "1";
  const featured = g("featured") === "1";
  const bestSeller = g("bestseller") === "1";
  const sort = (g("sort") as "newest" | "price_asc" | "price_desc" | "popular" | null) || "newest";
  const page = g("page") ? Math.max(1, parseInt(g("page")!, 10)) : 1;
  return {
    q,
    category,
    material,
    minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
    maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
    inStock,
    featured,
    bestSeller,
    sort: sort || "newest",
    page,
  };
}

function shopHref(sp: SearchParams, overrides: Record<string, string | undefined>) {
  const map = new Map<string, string>();
  for (const [k, v] of Object.entries(sp)) {
    if (v === undefined) continue;
    map.set(k, Array.isArray(v) ? v[0]! : v);
  }
  for (const [k, v] of Object.entries(overrides)) {
    if (v === undefined) map.delete(k);
    else map.set(k, v);
  }
  const params = new URLSearchParams();
  map.forEach((v, k) => params.set(k, v));
  return `/shop?${params.toString()}`;
}

async function ProductResults({ sp }: { sp: SearchParams }) {
  const f = parseParams(sp);
  const { products, total } = await getProducts({
    q: f.q,
    category: f.category,
    material: f.material,
    minPrice: f.minPrice,
    maxPrice: f.maxPrice,
    inStock: f.inStock,
    featured: f.featured,
    bestSeller: f.bestSeller,
    sort: f.sort,
    page: f.page,
    pageSize: 12,
  });
  const pages = Math.max(1, Math.ceil(total / 12));

  return (
    <>
      <div className="flex flex-col gap-2 border-b border-brand-espresso/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-espresso/50">Showing</p>
          <p className="mt-1 font-display text-2xl font-semibold text-brand-espresso">
            {total} piece{total === 1 ? "" : "s"}
            <span className="text-brand-espresso/45"> in this edit</span>
          </p>
        </div>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {products.length === 0 && (
        <p className="mt-12 rounded-2xl border border-dashed border-brand-espresso/20 bg-white/60 px-6 py-10 text-center text-sm text-brand-espresso/65">
          No products match these choices yet — try clearing filters or widening the price range.
        </p>
      )}
      {pages > 1 && (
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={shopHref(sp, { page: String(p) })}
              className={`inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm transition ${
                p === f.page
                  ? "border-brand-espresso bg-brand-espresso text-brand-cream shadow-soft"
                  : "border-brand-espresso/15 bg-white text-brand-espresso hover:border-brand-gold/50"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </>
  );
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const categories = await getCategories();

  return (
    <>
      <div className="relative overflow-hidden border-b border-brand-espresso/10 bg-gradient-to-br from-brand-mist/40 via-brand-cream to-white">
        <div className="pointer-events-none absolute -right-24 top-0 h-56 w-56 rounded-full bg-brand-gold/15 blur-3xl" aria-hidden />
        <Container className="relative py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-ember">Shop</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight text-brand-espresso sm:text-5xl">
            All products
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-brand-espresso/70 sm:text-base">
            Curated cookware and tools — filter by collection and material, then buy in one tap or line up a full bag for checkout.
          </p>
        </Container>
      </div>

      <Container className="pb-20 pt-10">
        <ShopFilters categories={categories} />
        <Suspense
          fallback={
            <div className="space-y-6">
              <Skeleton className="h-8 w-48" />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-[28rem]" />
                ))}
              </div>
            </div>
          }
        >
          <ProductResults sp={sp} />
        </Suspense>
      </Container>
    </>
  );
}
