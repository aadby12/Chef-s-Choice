import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { getFaqs } from "@/lib/data/content";
import { BRAND } from "@/lib/brand";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "FAQ",
  description: `Answers about orders, ${BRAND.city} delivery, Paystack payments, WhatsApp shopping, and product care — ${BRAND.name}.`,
  alternates: { canonical: absoluteUrl("/faq") },
  openGraph: {
    title: `FAQ · ${BRAND.name}`,
    description: `Orders, dispatch across Accra, materials, returns, and how to shop with confidence.`,
    url: absoluteUrl("/faq"),
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const faqs = await getFaqs();
  const faqJsonLd =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  const groups = faqs.reduce<Record<string, typeof faqs>>((acc, f) => {
    acc[f.category] = acc[f.category] ?? [];
    acc[f.category].push(f);
    return acc;
  }, {});

  return (
    <>
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}
      <section className="relative overflow-hidden border-b border-brand-espresso/10 bg-gradient-to-br from-brand-mist/45 via-brand-cream to-white">
        <div className="pointer-events-none absolute -right-20 top-0 h-56 w-56 rounded-full bg-brand-gold/15 blur-3xl" aria-hidden />
        <Container className="py-10 sm:py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-ember">FAQ</p>
          <h1 className="mt-2 font-display text-4xl text-brand-espresso sm:text-5xl">Frequently asked</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-brand-espresso/70 sm:text-base">
            Orders, delivery across Accra, payments, WhatsApp purchases, materials, and product care.
          </p>
        </Container>
      </section>
      <Container className="pb-16 pt-8">
      <div className="space-y-8">
        {Object.entries(groups).map(([cat, list]) => (
          <section key={cat}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-espresso/45">{cat}</h2>
            <div className="mt-4 space-y-3">
              {list.map((f) => (
                <details
                  key={f.id}
                  className="group rounded-[1.6rem] border border-brand-espresso/10 bg-white p-5 shadow-soft open:bg-brand-cream/40"
                >
                  <summary className="cursor-pointer list-none font-medium text-brand-espresso group-open:mb-2">
                    {f.question}
                  </summary>
                  <p className="text-sm leading-relaxed text-brand-espresso/75">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
        {faqs.length === 0 && (
          <p className="text-sm text-brand-espresso/60">FAQs will appear here once added in Supabase admin.</p>
        )}
      </div>
    </Container>
    </>
  );
}
