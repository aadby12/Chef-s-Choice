import type { Testimonial } from "@/types/domain";
import { Container } from "@/components/layout/container";

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials.length) return null;
  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-espresso/45">Testimonials</p>
        <h2 className="mt-2 font-display text-3xl text-brand-espresso sm:text-4xl">Loved in real kitchens</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.id} className="rounded-2xl border border-brand-espresso/10 bg-brand-cream p-6">
              <blockquote className="text-sm leading-relaxed text-brand-espresso/80">“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand-espresso/55">
                {t.author}
                {t.subtitle ? ` · ${t.subtitle}` : ""}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
