import type { MetadataRoute } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  let products: { slug: string; updated_at: string | null }[] | null = null;
  let categories: { slug: string; updated_at: string | null }[] | null = null;
  try {
    const supabase = await createSupabaseServerClient();
    const [p, c] = await Promise.all([
      supabase.from("products").select("slug, updated_at"),
      supabase.from("categories").select("slug, updated_at"),
    ]);
    products = p.data;
    categories = c.data;
  } catch {
    /* Build without DB if env missing */
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/shop",
    "/categories",
    "/about",
    "/contact",
    "/faq",
    "/search",
    "/cart",
    "/checkout",
    "/wishlist",
    "/auth/login",
    "/auth/signup",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const productUrls =
    products?.map((p) => ({
      url: `${base}/products/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    })) ?? [];

  const categoryUrls =
    categories?.map((c) => ({
      url: `${base}/categories/${c.slug}`,
      lastModified: c.updated_at ? new Date(c.updated_at) : new Date(),
    })) ?? [];

  return [...staticRoutes, ...categoryUrls, ...productUrls];
}
