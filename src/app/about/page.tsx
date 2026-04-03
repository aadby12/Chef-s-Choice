import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { BRAND } from "@/lib/brand";
import { PLACEHOLDER_LIFESTYLE } from "@/lib/placeholders";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About",
  description: `Learn how ${BRAND.fullName} brings premium cookware and joyful everyday cooking to ${BRAND.city} and Ghana.`,
  alternates: { canonical: absoluteUrl("/about") },
  openGraph: {
    title: `About · ${BRAND.name}`,
    description: `Our story — elevating the joy of cooking through curated kitchen essentials rooted in ${BRAND.city}.`,
    url: absoluteUrl("/about"),
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-brand-espresso/10 bg-[#17130f] text-brand-cream">
        <div className="pointer-events-none absolute -right-20 top-0 h-56 w-56 rounded-full bg-brand-gold/15 blur-3xl" aria-hidden />
        <Container className="py-10 sm:py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold/90">{BRAND.fullName}</p>
          <h1 className="mt-3 max-w-4xl font-display text-4xl tracking-tight sm:text-5xl lg:text-6xl">
            Elevating the joy of cooking through premium everyday essentials.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-brand-cream/75 sm:text-base">
            Maison Solange is rooted in Accra and built around the belief that beautiful cookware makes daily life feel more intentional, more confident, and more joyful.
          </p>
        </Container>
      </section>

      <Container className="pb-16 pt-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-brand-sand/30 shadow-lift">
            <Image src={PLACEHOLDER_LIFESTYLE} alt="Kitchen ritual" fill className="object-cover" sizes="50vw" />
          </div>
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-ember">Our philosophy</p>
              <h2 className="mt-2 font-display text-3xl text-brand-espresso sm:text-4xl">
                Curated for modern homes, hosts, and ambitious everyday cooks.
              </h2>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-brand-espresso/75">
              <p>
                Our debut line, <strong className="text-brand-espresso">{BRAND.name}</strong>, is intentionally edited:
                stainless steel for professional standards, non-stick ceramics for everyday ease, and cast iron for the kind of sear you hear before you see.
              </p>
              <p>
                We design for young professionals, home cooks, creators, newlyweds, and thoughtful hosts who want a kitchen that performs beautifully and looks equally considered.
              </p>
              <p>
                Tableware, a broader home collection, and a future bakeware atelier all sit on the roadmap, each shaped by the same premium standards and calm visual language.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.6rem] border border-brand-espresso/10 bg-white p-5 shadow-soft">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-ember">Curated</p>
                <p className="mt-2 text-sm text-brand-espresso/70">A tighter, better assortment over endless clutter.</p>
              </div>
              <div className="rounded-[1.6rem] border border-brand-espresso/10 bg-white p-5 shadow-soft">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-ember">Local</p>
                <p className="mt-2 text-sm text-brand-espresso/70">Accra-first logistics with human customer support.</p>
              </div>
              <div className="rounded-[1.6rem] border border-brand-espresso/10 bg-white p-5 shadow-soft">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-ember">Premium</p>
                <p className="mt-2 text-sm text-brand-espresso/70">Tools that feel elevated in use and display.</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
