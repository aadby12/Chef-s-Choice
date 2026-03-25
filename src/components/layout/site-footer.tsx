import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SiteFooter() {
  return (
    <footer className="border-t border-brand-espresso/10 bg-brand-mist/40">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-xl text-brand-espresso">{BRAND.fullName}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-brand-espresso/70">{BRAND.tagline}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-brand-espresso/45">Accra · Ghana</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-espresso/55">Shop</p>
            <ul className="mt-4 space-y-2 text-sm text-brand-espresso/75">
              <li>
                <Link href="/shop" className="hover:text-brand-espresso">
                  All products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-brand-espresso">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-brand-espresso">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-espresso/55">Support</p>
            <ul className="mt-4 space-y-2 text-sm text-brand-espresso/75">
              <li>
                <Link href="/contact" className="hover:text-brand-espresso">
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href={`https://wa.me/${BRAND.whatsappE164}`}
                  className="hover:text-brand-espresso"
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-espresso">
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-espresso/55">Newsletter</p>
            <p className="mt-3 text-sm text-brand-espresso/70">Restocks, bundles, and kitchen notes — quietly premium.</p>
            <form className="mt-4 flex flex-col gap-2 sm:flex-row" action="/api/newsletter" method="post">
              <Input name="email" type="email" required placeholder="Email address" className="sm:flex-1" />
              <Button type="submit" variant="primary" className="shrink-0">
                Join
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-brand-espresso/10 pt-8 text-xs text-brand-espresso/50 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Maison Solange. All rights reserved.</p>
          <div className="flex gap-4">
            <a href={BRAND.social.instagram} className="hover:text-brand-espresso" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <Link href="/admin/login" className="hover:text-brand-espresso">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
