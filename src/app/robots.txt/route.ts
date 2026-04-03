import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/site-url";

/** Route handler avoids next-metadata-route-loader (breaks when project path contains `'`). */
export async function GET() {
  const base = getSiteUrl().replace(/\/+$/, "");
  const host = base.replace(/^https?:\/\//, "").split("/")[0];
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin/",
    "Disallow: /admin",
    "Disallow: /api/",
    "",
    `Sitemap: ${base}/sitemap.xml`,
    `Host: ${host}`,
    "",
  ].join("\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
