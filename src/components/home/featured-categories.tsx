"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Category } from "@/types/domain";
import { PLACEHOLDER_LIFESTYLE } from "@/lib/placeholders";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

function GridIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={cn("h-3.5 w-3.5 shrink-0", className)} aria-hidden>
      <path
        fill="currentColor"
        d="M0 0h7v7H0V0zm9 0h7v7H9V0zM0 9h7v7H0V9zm9 9V9h7v7H9z"
        opacity="0.9"
      />
    </svg>
  );
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowOutIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M7 17l9.2-9.2M17 17V7H7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FeaturedCategories({ categories }: { categories: Category[] }) {
  const main = categories.filter((c) => !c.is_future_collection);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    reduceMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const scrollToIndex = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(main.length - 1, i));
    const el = cardRefs.current[clamped];
    if (!el) return;
    el.scrollIntoView({
      behavior: reduceMotionRef.current ? "auto" : "smooth",
      inline: "start",
      block: "nearest",
    });
    setActiveIndex(clamped);
  }, [main.length]);

  const scrollPrev = useCallback(() => scrollToIndex(activeIndex - 1), [activeIndex, scrollToIndex]);
  const scrollNext = useCallback(() => scrollToIndex(activeIndex + 1), [activeIndex, scrollToIndex]);

  /** Keep chip highlight in sync when the user swipes or drags the carousel */
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || main.length === 0) return;

    let raf = 0;
    const update = () => {
      const root = el.getBoundingClientRect();
      const center = root.left + root.width * 0.42;
      let best = 0;
      let bestDist = Infinity;
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const r = card.getBoundingClientRect();
        const mid = r.left + r.width / 2;
        const d = Math.abs(mid - center);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActiveIndex(best);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
    };
  }, [main.length]);

  if (main.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-12 sm:py-14 lg:py-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-brand-mist/40 to-transparent" aria-hidden />

      <Container>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-brand-espresso sm:text-4xl lg:text-[2.35rem]">
              Shop by category
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-espresso/55 sm:text-base">
              Curated collections designed to elevate your culinary experience — find your lane, then explore every piece.
            </p>
          </div>

          <div className="flex flex-shrink-0 flex-wrap items-center gap-3 lg:pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={scrollPrev}
                disabled={activeIndex <= 0}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full border border-brand-espresso/18 bg-white text-brand-espresso shadow-sm transition duration-300",
                  "hover:border-brand-gold/50 hover:bg-brand-cream active:scale-95",
                  "disabled:pointer-events-none disabled:opacity-35"
                )}
                aria-label="Previous categories"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                disabled={activeIndex >= main.length - 1}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full border border-brand-espresso/18 bg-white text-brand-espresso shadow-sm transition duration-300",
                  "hover:border-brand-gold/50 hover:bg-brand-cream active:scale-95",
                  "disabled:pointer-events-none disabled:opacity-35"
                )}
                aria-label="Next categories"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <Link
              href="/categories"
              className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-clay transition hover:text-brand-gold"
            >
              View all categories
              <span className="inline-flex transition duration-300 group-hover:translate-x-0.5" aria-hidden>
                →
              </span>
            </Link>
          </div>
        </div>

        <div
          className="mt-6 flex gap-2 overflow-x-auto pb-1 pt-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Jump to category"
        >
          {main.map((cat, i) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={activeIndex === i}
              onClick={() => scrollToIndex(i)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition duration-300",
                activeIndex === i
                  ? "border-brand-espresso bg-brand-espresso text-brand-cream shadow-md"
                  : "border-brand-espresso/14 bg-white text-brand-espresso/85 hover:border-brand-gold/45 hover:bg-brand-mist/35"
              )}
            >
              <GridIcon className={activeIndex === i ? "text-brand-gold" : "text-brand-espresso/45"} />
              {cat.name}
            </button>
          ))}
        </div>
      </Container>

      <div className="mt-6 w-full">
        <div
          ref={scrollerRef}
          className={cn(
            "flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 touch-pan-x",
            "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          )}
          style={{
            paddingLeft: "max(1rem, calc(50vw - 36rem))",
            paddingRight: "max(1rem, calc(50vw - 36rem))",
          }}
        >
          {main.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={cn(
                "group relative w-[min(76vw,280px)] shrink-0 snap-start overflow-hidden rounded-[1.75rem] sm:w-[300px]",
                "border border-brand-espresso/8 bg-brand-sand/20 shadow-[0_24px_60px_-32px_rgba(44,36,32,0.35)]",
                "transition duration-500 ease-out will-change-transform",
                "motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_32px_70px_-28px_rgba(44,36,32,0.42)]",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-terracotta"
              )}
            >
              <div className="relative aspect-[3/5] w-full overflow-hidden">
                <Image
                  src={cat.image_url || PLACEHOLDER_LIFESTYLE}
                  alt={cat.name}
                  fill
                  className={cn(
                    "object-cover transition duration-700 ease-out motion-safe:group-hover:scale-[1.06]",
                    "motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  )}
                  sizes="(max-width:640px)76vw,300px"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/35 to-transparent opacity-[0.92] transition duration-500 group-hover:opacity-[0.97]"
                  aria-hidden
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 sm:p-6">
                  <h3 className="font-display text-xl font-semibold leading-tight tracking-tight text-brand-cream sm:text-2xl">
                    {cat.name}
                  </h3>
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/12 text-brand-cream",
                      "backdrop-blur-sm transition duration-300 motion-safe:group-hover:rotate-45 motion-safe:group-hover:bg-brand-gold motion-safe:group-hover:text-brand-charcoal motion-safe:group-hover:border-brand-gold"
                    )}
                    aria-hidden
                  >
                    <ArrowOutIcon className="h-4 w-4 stroke-[2.25]" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
