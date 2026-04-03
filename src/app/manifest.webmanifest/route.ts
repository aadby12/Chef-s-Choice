import { NextResponse } from "next/server";
import { BRAND } from "@/lib/brand";
import { DEFAULT_DESCRIPTION } from "@/lib/seo";

/** Route handler avoids next-metadata-route-loader (breaks when project path contains `'`). */
export async function GET() {
  const body = {
    name: BRAND.fullName,
    short_name: BRAND.name,
    description: DEFAULT_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#FAF7F2",
    theme_color: "#2C2420",
    lang: "en-GH",
    orientation: "portrait-primary",
    categories: ["shopping", "food", "lifestyle"],
  };

  return NextResponse.json(body, {
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
