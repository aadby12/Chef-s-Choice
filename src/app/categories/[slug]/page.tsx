import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { Container } from "@/components/layout/container";
import { getCategoryBySlug, getProducts } from "@/lib/data/catalog";
import { BRAND } from "@/lib/brand";
import { absoluteUrl, breadcrumbListJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) return { title: "Collection" };
  const desc =
    cat.description?.trim() ||
    `Shop ${cat.name} — premium cookware and kitchen essentials from ${BRAND.fullName} in ${BRAND.city}.`;
  const url = absoluteUrl(`/categories/${slug}`);
  return {
    title: cat.name,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: `${cat.name} · ${BRAND.name}`,
      description: desc,
      url,
      type: "website",
      siteName: BRAND.fullName,
      locale: "en_GH",
    },
    twitter: {
      card: "summary_large_image",
      title: `${cat.name} · ${BRAND.name}`,
      description: desc,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) notFound();
  const { products } = await getProducts({ category: slug, pageSize: 48, page: 1 });

  const categoryUrl = absoluteUrl(`/categories/${slug}`);
  const collectionStructured = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: cat.name,
        description: cat.description ?? undefined,
        url: categoryUrl,
        isPartOf: { "@type": "WebSite", name: BRAND.fullName, url: absoluteUrl("/") },
      },
      breadcrumbListJsonLd([
        { name: "Home", path: "/" },
        { name: "Collections", path: "/categories" },
        { name: cat.name, path: `/categories/${slug}` },
      ]),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionStructured) }}
      />
      <div className="relative overflow-hidden border-b border-brand-espresso/10 bg-gradient-to-br from-brand-mist/45 via-brand-cream to-white">
        <div className="pointer-events-none absolute -right-20 top-0 h-52 w-52 rounded-full bg-brand-gold/15 blur-3xl" aria-hidden />
        <Container className="py-10 sm:py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-ember">Category</p>
          <h1 className="mt-2 font-display text-4xl text-brand-espresso sm:text-5xl">{cat.name}</h1>
          {cat.description && <p className="mt-4 max-w-2xl text-sm leading-relaxed text-brand-espresso/70">{cat.description}</p>}
        </Container>
      </div>
      <Container className="pb-14 pt-8">
        <div className="flex flex-col gap-3 border-b border-brand-espresso/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-espresso/50">Available now</p>
            <p className="mt-1 font-display text-2xl text-brand-espresso">
              {products.length} piece{products.length === 1 ? "" : "s"} in {cat.name}
            </p>
          </div>
          <a href="/shop" className="text-sm font-medium text-brand-terracotta hover:underline">
            Browse full shop
          </a>
        </div>
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {products.length === 0 && (
          <div className="mt-8 rounded-[1.8rem] border border-dashed border-brand-espresso/20 bg-white/60 px-5 py-8 text-center">
            <p className="font-display text-2xl text-brand-espresso">Pieces landing soon.</p>
            <p className="mt-3 text-sm text-brand-espresso/60">Browse the full shop while this category is being refreshed.</p>
          </div>
        )}
      </Container>
    </>
  );
}
