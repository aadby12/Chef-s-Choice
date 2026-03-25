import Link from "next/link";
import { Container } from "@/components/layout/container";
import { BRAND } from "@/lib/brand";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <Container className="pb-24">
      <h1 className="font-display text-3xl text-brand-espresso sm:text-4xl">We’re here to help</h1>
      <p className="mt-3 max-w-2xl text-sm text-brand-espresso/70">
        Questions on materials, delivery windows in Accra, or a bespoke bundle — message us anytime.
      </p>
      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <form className="space-y-4 rounded-2xl border border-brand-espresso/10 bg-white p-6 shadow-sm" action="/api/contact" method="post">
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
        <aside className="space-y-6 rounded-2xl border border-brand-espresso/10 bg-brand-mist/50 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-espresso/45">WhatsApp</p>
            <a
              href={`https://wa.me/${BRAND.whatsappE164}`}
              className="mt-2 inline-flex text-sm font-semibold text-brand-terracotta hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Open chat
            </a>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-espresso/45">Email</p>
            <p className="mt-2 text-sm text-brand-espresso/75">{BRAND.email}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-espresso/45">Dispatch</p>
            <p className="mt-2 text-sm text-brand-espresso/75">
              24–48 hour delivery across Accra · Premium packaging · COD available
            </p>
          </div>
          <Link href="/faq" className="inline-flex text-sm font-medium text-brand-terracotta hover:underline">
            Browse FAQs →
          </Link>
        </aside>
      </div>
    </Container>
  );
}
