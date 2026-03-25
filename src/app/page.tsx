import { HeroSection } from "@/components/home/hero-section";
import { CATALOG_MEDIA } from "@/lib/catalog-local-images";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { ProductGridSection } from "@/components/home/product-grid-section";
import {
  BrandStory,
  BundlePromo,
  EducationStrip,
  InstagramStrip,
  LifestyleBand,
  ShopByMaterial,
  WhatsappCta,
  WhyChooseUs,
} from "@/components/home/editorial-sections";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { getCategories, getProducts } from "@/lib/data/catalog";
import { getHomepageSections, getTestimonials } from "@/lib/data/content";
import type { HomepageSection } from "@/types/domain";

export const dynamic = "force-dynamic";

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
        subtitle="Editor’s selection"
        products={featured.products.length ? featured.products : featuredList}
        href="/shop?featured=1"
        linkLabel="Browse featured"
      />
      <ProductGridSection
        title="Best sellers"
        subtitle="Accra favorites"
        products={best.products.length ? best.products : featuredList}
        href="/shop?bestseller=1"
        linkLabel="Shop best sellers"
      />
      <BrandStory />
      <WhyChooseUs />
      <ShopByMaterial />
      <EducationStrip />
      <LifestyleBand />
      <TestimonialsSection testimonials={testimonials} />
      <BundlePromo />
      <WhatsappCta />
      <InstagramStrip />
    </>
  );
}
