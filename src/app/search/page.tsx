import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { ProductCard } from "@/components/product/product-card";
import { getProducts } from "@/lib/data/catalog";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

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
      {products.length === 0 && <p className="mt-10 text-sm text-brand-espresso/60">Try a broader term or browse collections.</p>}
    </>
  );
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";

  return (
    <Container className="pb-20">
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
