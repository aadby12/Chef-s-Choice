import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";
import { CATALOG_MEDIA } from "@/lib/catalog-local-images";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { ProductGridSection } from "@/components/home/product-grid-section";
import {
  BundlePromo,
  InstagramStrip,
  WhatsappCta,
  WhyChooseUs,
} from "@/components/home/editorial-sections";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { getCategories, getProducts } from "@/lib/data/catalog";
import { getHomepageSections, getTestimonials } from "@/lib/data/content";
import type { HomepageSection } from "@/types/domain";
import { BRAND } from "@/lib/brand";
import { DEFAULT_DESCRIPTION, absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${BRAND.fullName} · ${BRAND.tagline}`,
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: absoluteUrl("/"),
    languages: { "en-GH": absoluteUrl("/") },
  },
  openGraph: {
    title: `${BRAND.fullName} · ${BRAND.tagline}`,
    description: DEFAULT_DESCRIPTION,
    url: absoluteUrl("/"),
    type: "website",
  },
};

function sectionBody(sections: HomepageSection[], key: string) {
  return sections.find((s) => s.section_key === key)?.body ?? {};
}

export default async function HomePage() {
  const [categories, featured, best, testimonials, sections] = await Promise.all([
    getCategories(),
    getProducts({ featured: true, pageSize: 4, page: 1 }),
    getProducts({ bestSeller: true, pageSize: 4, page: 1 }),
    getTestimonials(true),
    getHomepageSections(),
  ]);

  const hero = sectionBody(sections, "hero");
  const headline =
    (hero.headline as string) || "The art of the everyday table";
  const subheadline =
    (hero.subheadline as string) ||
    "Statement cookware and tools — curated for Accra, styled like a gallery — from enamel colour to mirror stainless.";
  const heroImage = (hero.imageUrl as string)?.trim() || CATALOG_MEDIA.heroCreuset;

  const featuredList = featured.products.length ? featured.products : best.products;

  return (
    <>
      <HeroSection headline={headline} subheadline={subheadline} imageUrl={heroImage} />
      <FeaturedCategories categories={categories} />
      <ProductGridSection
        title="Featured pieces"
        subtitle="Featured products"
        products={featured.products.length ? featured.products : featuredList}
        href="/shop?featured=1"
        linkLabel="Shop featured"
      />
      <BundlePromo />
      <ProductGridSection
        title="Best sellers"
        subtitle="Best sellers"
        products={best.products.length ? best.products : featuredList}
        href="/shop?bestseller=1"
        linkLabel="View best sellers"
      />
      <WhyChooseUs />
      <TestimonialsSection testimonials={testimonials} />
      <WhatsappCta />
      <InstagramStrip />
    </>
  );
}
