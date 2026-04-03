import type { ReactNode } from "react";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const footerLink = cn(
  "group inline-flex items-center gap-1.5 rounded-md py-0.5 text-sm text-brand-espresso/72",
  "transition duration-200 ease-out hover:text-brand-espresso hover:translate-x-0.5"
);

function FooterColumnTitle({ children }: { children: ReactNode }) {
  return (
    <p className="relative pl-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-espresso">
      <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-brand-gold to-brand-ember" aria-hidden />
      {children}
    </p>
  );
}

function CheckItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3 text-sm leading-snug text-brand-espresso/75">
      <span
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-brand-gold/35 bg-brand-gold/10 text-[11px] font-bold text-brand-ember"
        aria-hidden
      >
        ✓
      </span>
      <span>{children}</span>
    </li>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-brand-espresso/10 bg-gradient-to-b from-brand-sand/30 via-[#FAF7F2] to-brand-mist/40">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold/55 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 top-32 h-72 w-72 rounded-full bg-brand-gold/[0.07] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-40 h-64 w-64 rounded-full bg-brand-ember/[0.06] blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-brand-charcoal shadow-[0_28px_80px_-28px_rgba(26,22,20,0.65)]">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_90%_-10%,rgba(201,162,39,0.12),transparent_50%),radial-gradient(ellipse_70%_50%_at_0%_100%,rgba(184,107,76,0.08),transparent_45%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-grain-soft opacity-[0.28] mix-blend-overlay"
            aria-hidden
          />
          <div className="relative px-6 py-9 sm:px-9 sm:py-11 lg:px-11 lg:py-12">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
              <div className="min-w-0 max-w-2xl text-brand-cream lg:pt-0.5">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.26em] text-brand-gold/90">
                  <span className="h-px w-6 bg-brand-gold/50" aria-hidden />
                  Join our kitchen community
                </p>
                <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl lg:text-[2.35rem] lg:leading-[1.15]">
                  Restocks, cooking notes, and first access to curated drops.
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-brand-cream/75">
                  Add your email — we will send launch alerts and seasonal bundles only when they matter.
                </p>
              </div>
              <form
                className="relative z-10 w-full max-w-md shrink-0 rounded-2xl border border-white/14 bg-white/[0.07] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md sm:p-6 lg:max-w-[min(100%,24rem)]"
                action="/api/newsletter"
                method="post"
                aria-label="Newsletter signup"
              >
                <Label htmlFor="footer-newsletter-email" className="mb-2 text-[11px] text-brand-cream/65">
                  Email
                </Label>
                <div className="flex flex-col gap-3">
                  <Input
                    id="footer-newsletter-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="relative z-10 h-12 min-h-12 border-brand-espresso/15 bg-white text-brand-charcoal shadow-md placeholder:text-brand-espresso/45 focus-visible:z-20 focus-visible:border-brand-gold focus-visible:ring-2 focus-visible:ring-brand-gold/35"
                  />
                  <button
                    type="submit"
                    className="inline-flex h-12 min-h-[48px] w-full items-center justify-center rounded-xl border-2 border-brand-cream/25 bg-[#C9A227] px-6 text-base font-semibold tracking-wide text-[#1A1614] shadow-[0_1px_0_rgba(255,255,255,0.45)_inset,0_10px_28px_-12px_rgba(0,0,0,0.55)] transition-all duration-200 hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cream active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
                  >
                    Subscribe
                  </button>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-brand-cream/50">
                  No spam. Unsubscribe anytime from any email we send.
                </p>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-[2rem] border border-brand-espresso/[0.09] bg-white/75 p-7 shadow-[0_20px_50px_-28px_rgba(44,36,32,0.18)] backdrop-blur-sm sm:p-9 lg:mt-16 lg:p-10">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-10">
            <div className="md:col-span-2 lg:col-span-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-ember">Chef&apos;s Choice</p>
              <p className="mt-3 font-display text-3xl text-brand-espresso">{BRAND.name}</p>
              <p className="mt-1 text-sm font-medium uppercase tracking-[0.18em] text-brand-espresso/45">{BRAND.byline}</p>
              <p className="mt-1 font-display text-lg italic text-brand-clay/90">{BRAND.tagline}</p>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-espresso/72">
                Premium cookware and kitchen essentials curated for beautiful everyday cooking in {BRAND.city}.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${BRAND.email}`}
                  className="inline-flex items-center gap-2 rounded-full border border-brand-espresso/10 bg-brand-mist/50 px-4 py-2 text-xs font-medium text-brand-espresso/80 transition hover:border-brand-gold/35 hover:bg-white hover:text-brand-espresso"
                >
                  <span className="text-brand-gold" aria-hidden>
                    ✉
                  </span>
                  {BRAND.email}
                </a>
                <span className="text-xs uppercase tracking-[0.2em] text-brand-espresso/38">{BRAND.city} · {BRAND.country}</span>
              </div>
              <a
                href={BRAND.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="group mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand-espresso/70 transition hover:text-brand-ember"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-espresso/12 bg-brand-cream text-brand-espresso shadow-sm transition group-hover:border-brand-gold/30">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </span>
                Follow on Instagram
              </a>
            </div>

            <div className="lg:col-span-2 lg:pt-1">
              <FooterColumnTitle>Shop</FooterColumnTitle>
              <ul className="mt-5 space-y-3">
                <li>
                  <Link href="/shop" className={footerLink}>
                    All products
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className={footerLink}>
                    Collections
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className={footerLink}>
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/wishlist" className={footerLink}>
                    Wishlist
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2 lg:pt-1">
              <FooterColumnTitle>Customer care</FooterColumnTitle>
              <ul className="mt-5 space-y-3">
                <li>
                  <Link href="/contact" className={footerLink}>
                    Contact
                  </Link>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${BRAND.whatsappE164}`}
                    className={footerLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp
                    <span className="text-[10px] opacity-60 transition group-hover:opacity-100" aria-hidden>
                      ↗
                    </span>
                  </a>
                </li>
                <li>
                  <Link href="/about" className={footerLink}>
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/account/orders" className={footerLink}>
                    Track orders
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-3 lg:pt-1">
              <FooterColumnTitle>Why customers return</FooterColumnTitle>
              <ul className="mt-5 space-y-4">
                <CheckItem>Fast local dispatch across Accra.</CheckItem>
                <CheckItem>Secure card checkout and WhatsApp support.</CheckItem>
                <CheckItem>Premium collections selected for real homes.</CheckItem>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-brand-espresso/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-brand-espresso/50">
            © {new Date().getFullYear()} Maison Solange. Crafted with care in {BRAND.country}.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={BRAND.social.instagram}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-brand-espresso/10 bg-white/80 px-4 py-2 text-xs font-medium text-brand-espresso/65 transition hover:border-brand-gold/35 hover:text-brand-espresso"
            >
              Instagram
            </a>
            <Link
              href="/admin/login"
              className="rounded-full border border-brand-espresso/10 bg-white/80 px-4 py-2 text-xs font-medium text-brand-espresso/65 transition hover:border-brand-espresso/20 hover:text-brand-espresso"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
