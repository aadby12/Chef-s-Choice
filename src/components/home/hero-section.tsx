"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
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
  const slides = useMemo(() => {
    const list = [
      imageUrl?.trim(),
      CATALOG_MEDIA.heroCreuset,
      CATALOG_MEDIA.lifestyleEnameled,
      CATALOG_MEDIA.editorialKitchen,
      CATALOG_MEDIA.colorfulDutch,
    ].filter(Boolean) as string[];
    return list.length > 0 ? list : [PLACEHOLDER_HERO];
  }, [imageUrl]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [pauseCarousel, setPauseCarousel] = useState(false);
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    reduceMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    setActiveSlide(0);
  }, [imageUrl]);

  useEffect(() => {
    if (slides.length <= 1) return;
    if (reduceMotionRef.current || pauseCarousel) return;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [slides.length, pauseCarousel]);

  return (
    <section className="relative isolate overflow-hidden border-b border-brand-espresso/10 bg-[#17130f] text-brand-cream">
      <div
        className="pointer-events-none absolute -left-32 top-0 h-[120%] w-[70%] rounded-full bg-brand-gold/12 blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 h-[80%] w-[50%] rounded-full bg-brand-terracotta/20 blur-[100px]"
        aria-hidden
      />

      <Container className="relative grid gap-6 py-8 sm:py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-10 lg:py-12">
        <div className="order-2 lg:order-1">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-gold/90 backdrop-blur-sm">
            <span>Chef&apos;s Choice</span>
            <span className="h-1 w-1 rounded-full bg-brand-gold/80" aria-hidden />
            <span className="text-brand-cream/70">{BRAND.city}</span>
          </div>
          <h1 className="mt-4 max-w-2xl font-display text-[3rem] font-semibold leading-[0.95] tracking-tight text-balance sm:text-5xl lg:text-6xl xl:text-[4.25rem]">
            {headline}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-brand-cream/78 sm:text-lg text-balance">
            {subheadline}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/shop"
              className={cn(
                "inline-flex min-h-12 items-center justify-center rounded-full bg-brand-gold px-8 text-base font-semibold text-brand-charcoal shadow-glow transition hover:bg-[#d4ad32]"
              )}
            >
              Shop now
            </Link>
            <Link
              href="/categories"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-brand-cream/25 bg-white/5 px-8 text-base font-medium text-brand-cream backdrop-blur-sm transition hover:bg-white/12"
            >
              Explore categories
            </Link>
          </div>
          <div className="mt-7 grid gap-3 sm:gap-4 lg:max-w-2xl lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
            <div className="flex flex-col rounded-[1.8rem] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-md sm:p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-gold/90">Featured this week</p>
              <h2 className="mt-2 font-display text-2xl text-brand-cream sm:text-[1.9rem]">
                Premium cookware for beautiful everyday meals.
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-brand-cream/75">
                Shop handpicked essentials, statement serving pieces, and kitchen upgrades chosen to make your home feel more polished.
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-brand-cream/80">
                <div>
                  <p className="font-display text-2xl text-brand-gold">24-48h</p>
                  <p>Accra dispatch</p>
                </div>
                <div>
                  <p className="font-display text-2xl text-brand-gold">Curated</p>
                  <p>Premium categories</p>
                </div>
              </div>
            </div>
            <div className="flex h-full min-h-0 flex-col gap-3">
              <div className="flex flex-1 flex-col rounded-[1.8rem] border border-white/10 bg-white/[0.06] px-4 py-4 backdrop-blur-md sm:px-5 sm:py-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-gold/90">Why customers shop here</p>
                <p className="mt-2 text-sm leading-relaxed text-brand-cream/78">
                  A cleaner shopping experience, boutique support, and premium pieces chosen for modern Ghanaian homes.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-brand-cream/55">
                <span className="h-px flex-1 bg-white/10" aria-hidden />
                <span>Scroll</span>
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div
            className="relative mx-auto max-w-lg lg:max-w-none"
            role="region"
            aria-roledescription="carousel"
            aria-label="Featured imagery"
            onMouseEnter={() => setPauseCarousel(true)}
            onMouseLeave={() => setPauseCarousel(false)}
            onFocusCapture={() => setPauseCarousel(true)}
            onBlurCapture={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setPauseCarousel(false);
            }}
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand-gold/20 via-transparent to-brand-wine/20 blur-2xl" aria-hidden />
            <div
              id="hero-slide-panel"
              className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-glow ring-2 ring-white/10 sm:aspect-[3/4] lg:aspect-[4/5]"
            >
              {slides.map((slide, index) => (
                <div
                  key={`${slide}-${index}`}
                  className="absolute inset-0"
                  aria-hidden={index !== activeSlide}
                >
                  <Image
                    src={slide}
                    alt={index === activeSlide ? headline : ""}
                    fill
                    priority={index === 0}
                    className={cn(
                      "object-cover transition-all duration-700 ease-out motion-reduce:transition-none",
                      index === activeSlide ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
                    )}
                    sizes="(max-width:1024px) 100vw, 50vw"
                  />
                </div>
              ))}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-charcoal/55 via-transparent to-brand-charcoal/20" />
              {slides.length > 1 && (
                <div
                  className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-white/10 bg-brand-charcoal/55 px-3 py-2 backdrop-blur-md"
                  role="group"
                  aria-label="Choose slide"
                >
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      aria-controls="hero-slide-panel"
                      aria-current={index === activeSlide ? "true" : undefined}
                      onClick={() => setActiveSlide(index)}
                      className={cn(
                        "h-2.5 w-2.5 rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold",
                        index === activeSlide ? "bg-brand-gold" : "bg-white/35 hover:bg-white/55"
                      )}
                      aria-label={`Show slide ${index + 1} of ${slides.length}`}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="absolute bottom-4 left-4 right-4 rounded-[1.6rem] border border-white/10 bg-brand-charcoal/78 px-4 py-3 text-brand-cream backdrop-blur-md sm:px-5 sm:py-3.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-gold/90">Collection spotlight</p>
              <div className="mt-2 flex items-end justify-between gap-4">
                <div>
                  <p className="font-display text-2xl">Kitchen essentials</p>
                  <p className="mt-1 text-sm text-brand-cream/70">Modern cookware, elevated presentation.</p>
                </div>
                <Link
                  href="/shop?featured=1"
                  className="inline-flex min-h-10 items-center justify-center rounded-full bg-white px-4 text-sm font-semibold text-brand-charcoal transition hover:bg-brand-cream"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
