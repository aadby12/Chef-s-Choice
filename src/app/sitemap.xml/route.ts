import { getSiteUrl } from "@/lib/site-url";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildSitemapXml(
  entries: { url: string; lastModified: Date }[],
): string {
  const urls = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${escapeXml(e.url)}</loc>\n    <lastmod>${e.lastModified.toISOString()}</lastmod>\n  </url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export async function GET() {
  const base = getSiteUrl();

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
    /* Serve static URLs only if env / DB unavailable */
  }

  const staticPaths = [
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
  ];

  const staticRoutes = staticPaths.map((path) => ({
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

  const xml = buildSitemapXml([
    ...staticRoutes,
    ...categoryUrls,
    ...productUrls,
  ]);

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
