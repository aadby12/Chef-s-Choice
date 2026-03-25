import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { PLACEHOLDER_HERO } from "@/lib/placeholders";
import { CATALOG_MEDIA } from "@/lib/catalog-local-images";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

export function HeroSection({
  headline,
  subheadline,
  imageUrl,
}: {
  headline: string;
  subheadline: string;
  imageUrl?: string;
}) {
  const src = imageUrl?.trim() || CATALOG_MEDIA.heroCreuset || PLACEHOLDER_HERO;

  return (
    <section className="relative isolate overflow-hidden bg-brand-charcoal text-brand-cream">
      {/* ambient */}
      <div
        className="pointer-events-none absolute -left-32 top-0 h-[120%] w-[70%] rounded-full bg-brand-gold/15 blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 h-[80%] w-[50%] rounded-full bg-brand-terracotta/20 blur-[100px]"
        aria-hidden
      />

      <Container className="relative grid gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-14 lg:py-24">
        <div className="order-2 lg:order-1">
          <div className="inline-flex items-center gap-3 border-l-4 border-brand-gold pl-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-brand-cream/80">{BRAND.tagline}</p>
          </div>
          <h1 className="mt-6 font-display text-[2.65rem] font-semibold leading-[1.02] tracking-tight text-balance sm:text-5xl lg:text-6xl xl:text-[3.5rem]">
            {headline}
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-brand-cream/85 sm:text-lg text-balance">
            {subheadline}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/shop"
              className={cn(
                "inline-flex min-h-12 items-center justify-center rounded-full bg-brand-gold px-8 text-base font-semibold text-brand-charcoal shadow-glow transition hover:bg-[#d4ad32]"
              )}
            >
              Shop collection
            </Link>
            <Link
              href="/categories"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-brand-cream/35 bg-white/5 px-8 text-base font-medium text-brand-cream backdrop-blur-sm transition hover:bg-white/12"
            >
              Explore collections
            </Link>
          </div>
          <ul className="mt-12 grid gap-3 text-xs text-brand-cream/85 sm:grid-cols-2 lg:max-w-xl">
            <li className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-md">
              <span className="font-semibold text-brand-gold/95">Curated</span> · gallery-worthy silhouettes
            </li>
            <li className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-md">
              <span className="font-semibold text-brand-gold/95">24–48h</span> · Accra dispatch window
            </li>
            <li className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-md sm:col-span-2 lg:col-span-1">
              <span className="font-semibold text-brand-gold/95">Concierge</span> · WhatsApp for real advice
            </li>
          </ul>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative mx-auto max-w-lg lg:max-w-none">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand-gold/25 via-transparent to-brand-wine/20 blur-2xl" aria-hidden />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] shadow-glow ring-2 ring-white/10 sm:aspect-[3/4] lg:aspect-[4/5]">
              <Image src={src} alt="" fill priority className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-charcoal/50 via-transparent to-brand-charcoal/25" />
            </div>
            <p className="mt-4 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-brand-cream/45 lg:text-left">
              Maison Solange · Art direction
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
