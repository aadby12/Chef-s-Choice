import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductDetailActions } from "@/components/product/product-detail-actions";
import { ProductTabs } from "@/components/product/product-tabs";
import { ProductCard } from "@/components/product/product-card";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/catalog";
import { getReviewsForProduct } from "@/lib/data/reviews";
import { BRAND } from "@/lib/brand";
import { absoluteUrl, breadcrumbListJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product" };
  const url = absoluteUrl(`/products/${slug}`);
  const desc = product.short_description ?? product.name;
  const firstImage = product.product_images?.[0]?.url;
  return {
    title: product.name,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${product.name} · ${BRAND.name}`,
      description: desc,
      siteName: BRAND.fullName,
      images: firstImage ? [{ url: firstImage, alt: product.name }] : undefined,
      locale: "en_GH",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: desc,
      images: firstImage ? [firstImage] : undefined,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [reviews, related] = await Promise.all([
    getReviewsForProduct(product.id),
    getRelatedProducts(product.category_id, product.id, 4),
  ]);

  const productUrl = absoluteUrl(`/products/${slug}`);
  const cat = product.categories;
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    ...(cat ? [{ name: cat.name, path: `/categories/${cat.slug}` }] : []),
    { name: product.name, path: `/products/${slug}` },
  ];
  const productNode = {
    "@type": "Product",
    name: product.name,
    description: product.short_description ?? product.name,
    sku: product.sku,
    url: productUrl,
    brand: { "@type": "Brand", name: BRAND.fullName },
    image: product.product_images?.map((i) => i.url),
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "GHS",
      price: String(product.price),
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    ...(product.review_count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.review_count,
          },
        }
      : {}),
  };
  const structured = {
    "@context": "https://schema.org",
    "@graph": [productNode, breadcrumbListJsonLd(breadcrumbItems)],
  };

  return (
    <Container className="pb-14 pt-5">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured) }} />
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-espresso/45">
          {product.categories?.name ?? "Product"}
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-tight text-brand-espresso sm:text-5xl">
          {product.name}
        </h1>
      </div>
      <div className="grid gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="space-y-5">
          <ProductGallery images={product.product_images ?? []} productName={product.name} />
        </div>
        <ProductDetailActions product={product} />
      </div>
      <ProductTabs product={product} reviews={reviews} />
      {related.length > 0 && (
        <section className="mt-10 border-t border-brand-espresso/10 pt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-espresso/45">You may also love</p>
              <h2 className="mt-2 font-display text-2xl text-brand-espresso">More from this world</h2>
            </div>
            <p className="max-w-xl text-sm text-brand-espresso/60">
              Complementary pieces selected from the same category to help you build a more complete kitchen setup.
            </p>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
