import { Container } from "@/components/layout/container";
import { getFaqs } from "@/lib/data/content";

export const metadata = { title: "FAQ" };

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const faqs = await getFaqs();
  const groups = faqs.reduce<Record<string, typeof faqs>>((acc, f) => {
    acc[f.category] = acc[f.category] ?? [];
    acc[f.category].push(f);
    return acc;
  }, {});

  return (
    <Container className="pb-24">
      <h1 className="font-display text-3xl text-brand-espresso sm:text-4xl">Frequently asked</h1>
      <p className="mt-3 max-w-2xl text-sm text-brand-espresso/70">
        Orders, delivery across Accra, Mobile Money, WhatsApp purchases, materials, and care.
      </p>
      <div className="mt-12 space-y-12">
        {Object.entries(groups).map(([cat, list]) => (
          <section key={cat}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-espresso/45">{cat}</h2>
            <div className="mt-4 space-y-3">
              {list.map((f) => (
                <details
                  key={f.id}
                  className="group rounded-2xl border border-brand-espresso/10 bg-white p-4 shadow-sm open:bg-brand-cream/40"
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
  );
}
