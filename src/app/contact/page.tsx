import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { BRAND } from "@/lib/brand";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${BRAND.fullName} — delivery in ${BRAND.city}, order help, WhatsApp, and product questions.`,
  alternates: { canonical: absoluteUrl("/contact") },
  openGraph: {
    title: `Contact · ${BRAND.name}`,
    description: `We're here to help with orders, materials, gifting, and delivery across ${BRAND.city}.`,
    url: absoluteUrl("/contact"),
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-brand-espresso/10 bg-gradient-to-br from-brand-mist/45 via-brand-cream to-white">
        <div className="pointer-events-none absolute -right-20 top-0 h-56 w-56 rounded-full bg-brand-gold/15 blur-3xl" aria-hidden />
        <Container className="py-10 sm:py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-ember">Contact</p>
          <h1 className="mt-2 font-display text-4xl text-brand-espresso sm:text-5xl">We’re here to help</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-brand-espresso/70 sm:text-base">
            Questions on materials, delivery windows in Accra, gifting, or a bespoke bundle? Reach out and we’ll help you shop with confidence.
          </p>
        </Container>
      </section>
      <Container className="pb-16 pt-8">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <form className="space-y-4 rounded-[2rem] border border-brand-espresso/10 bg-white p-6 shadow-soft sm:p-8" action="/api/contact" method="post">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="mt-1 w-full rounded-xl border border-brand-espresso/10 bg-white px-4 py-3 text-sm shadow-sm focus:border-brand-clay focus:outline-none focus:ring-2 focus:ring-brand-clay/25"
            />
          </div>
          <Button type="submit" variant="primary">
            Send message
          </Button>
        </form>
        <aside className="space-y-6 rounded-[2rem] border border-brand-espresso/10 bg-brand-charcoal p-6 text-brand-cream shadow-lift sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold/85">WhatsApp</p>
            <a
              href={`https://wa.me/${BRAND.whatsappE164}`}
              className="mt-2 inline-flex text-sm font-semibold text-brand-cream hover:text-brand-gold"
              target="_blank"
              rel="noreferrer"
            >
              Open chat
            </a>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold/85">Email</p>
            <p className="mt-2 text-sm text-brand-cream/75">{BRAND.email}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold/85">Dispatch</p>
            <p className="mt-2 text-sm text-brand-cream/75">
              24–48 hour delivery across Accra · Premium packaging · COD available
            </p>
          </div>
          <div className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm text-brand-cream/75">
            <p>Need help choosing materials or comparing products?</p>
            <p>Prefer to order through WhatsApp? We can assist there too.</p>
          </div>
          <Link href="/faq" className="inline-flex text-sm font-medium text-brand-gold hover:underline">
            Browse FAQs →
          </Link>
        </aside>
      </div>
    </Container>
    </>
  );
}
