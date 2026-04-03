import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { ProductCard } from "@/components/product/product-card";
import { getProducts } from "@/lib/data/catalog";
import { Skeleton } from "@/components/ui/skeleton";
import { BRAND } from "@/lib/brand";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const q = (await searchParams).q?.trim();
  const title = q ? `Search results for "${q}"` : "Search";
  return {
    title,
    description: q
      ? `Product search results for "${q}" on ${BRAND.fullName}.`
      : `Search ${BRAND.name} for cookware and kitchen essentials.`,
    robots: { index: false, follow: true },
  };
}

async function Results({ q }: { q: string }) {
  const { products, total } = await getProducts({ q, pageSize: 24, page: 1 });
  return (
    <>
      <p className="text-sm text-brand-espresso/60">
        {total} result{total === 1 ? "" : "s"} for “{q}”
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {products.length === 0 && <p className="mt-7 text-sm text-brand-espresso/60">Try a broader term or browse collections.</p>}
    </>
  );
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";

  return (
    <Container className="pb-14">
      <h1 className="font-display text-3xl text-brand-espresso">Search</h1>
      {!q ? (
        <p className="mt-4 text-sm text-brand-espresso/65">Enter a search query from the header (desktop) or shop filters.</p>
      ) : (
        <Suspense
          fallback={
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-80" />
              ))}
            </div>
          }
        >
          <div className="mt-6">
            <Results q={q} />
          </div>
        </Suspense>
      )}
    </Container>
  );
}
