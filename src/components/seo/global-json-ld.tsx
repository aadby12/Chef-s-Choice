import { BRAND } from "@/lib/brand";
import { absoluteUrl } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

export function GlobalJsonLd() {
  const base = getSiteUrl().replace(/\/+$/, "");
  const organization = {
    "@type": "Organization",
    name: BRAND.fullName,
    alternateName: [BRAND.name, "Maison Solange"],
    url: base,
    description:
      "Premium cookware and kitchen essentials curated for everyday cooking in Accra and across Ghana.",
    email: BRAND.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: BRAND.city,
      addressCountry: BRAND.country,
    },
    sameAs: [BRAND.social.instagram].filter(Boolean),
  };

  const website = {
    "@type": "WebSite",
    name: BRAND.fullName,
    url: base,
    description:
      "Shop curated cookware with secure Paystack checkout, fast Accra dispatch, and WhatsApp support.",
    publisher: { "@type": "Organization", name: BRAND.fullName },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl("/search")}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const structured = {
    "@context": "https://schema.org",
    "@graph": [organization, website],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structured) }}
    />
  );
}
