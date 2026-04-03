import type { Testimonial } from "@/types/domain";
import { Container } from "@/components/layout/container";

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials.length) return null;
  return (
    <section className="bg-white py-12 sm:py-16">
      <Container>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-espresso/45">Testimonials</p>
            <h2 className="mt-1.5 font-display text-3xl text-brand-espresso sm:text-4xl">Loved in real kitchens</h2>
          </div>
          <p className="max-w-xl text-sm text-brand-espresso/65">
            Feedback from customers using Chef&apos;s Choice to stock new homes, refresh weeknight routines, and host beautifully.
          </p>
        </div>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.id} className="rounded-[1.7rem] border border-brand-espresso/10 bg-brand-cream/70 p-6 shadow-soft">
              <p className="font-display text-4xl leading-none text-brand-gold/50">“</p>
              <blockquote className="mt-3 text-sm leading-relaxed text-brand-espresso/80">{t.quote}”</blockquote>
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
