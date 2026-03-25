import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { Container } from "@/components/layout/container";
import { getCategoryBySlug, getProducts } from "@/lib/data/catalog";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) return { title: "Collection" };
  return { title: cat.name, description: cat.description ?? cat.name };
}

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) notFound();
  const { products } = await getProducts({ category: slug, pageSize: 48, page: 1 });

  return (
    <Container className="pb-20">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-espresso/45">Collection</p>
      <h1 className="mt-2 font-display text-3xl text-brand-espresso sm:text-4xl">{cat.name}</h1>
      {cat.description && <p className="mt-4 max-w-2xl text-sm text-brand-espresso/70">{cat.description}</p>}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {products.length === 0 && (
        <p className="mt-10 text-sm text-brand-espresso/60">Pieces landing soon — browse the full shop.</p>
      )}
    </Container>
  );
}
