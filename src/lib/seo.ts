import { BRAND } from "@/lib/brand";
import { getSiteUrl } from "@/lib/site-url";

/** Primary keywords for Ghana / kitchen retail; refine in one place. */
export const SITE_KEYWORDS = [
  "cookware Ghana",
  "kitchenware Accra",
  "buy cookware online Ghana",
  "premium pots and pans",
  "chef cookware",
  "Maison Solange",
  BRAND.name,
  BRAND.tagline,
  "non-stick Accra",
  "cast iron Ghana",
  "kitchen essentials",
  "Paystack checkout",
  "dutch oven Ghana",
  "stainless steel cookware",
] as const;

export const DEFAULT_DESCRIPTION =
  "Premium cookware and kitchen essentials curated for beautiful everyday cooking in Accra — secure checkout, fast local dispatch, WhatsApp support.";

export function absoluteUrl(path: string): string {
  const base = getSiteUrl().replace(/\/+$/, "");
  if (!path || path === "/") return base;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export function pageTitle(pageLabel: string): string {
  return `${pageLabel} · ${BRAND.name}`;
}

/** Schema.org BreadcrumbList item URLs must be absolute. */
export function breadcrumbListJsonLd(
  items: { name: string; path: string }[],
): { "@type": string; itemListElement: object[] } {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
