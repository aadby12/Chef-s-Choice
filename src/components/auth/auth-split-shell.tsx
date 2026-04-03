"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { BRAND } from "@/lib/brand";

export function AuthSplitShell({
  title,
  subtitle,
  kicker = BRAND.name,
  heroSrc,
  heroAlt,
  children,
}: {
  title: string;
  subtitle: string;
  kicker?: string;
  heroSrc: string;
  heroAlt: string;
  children: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden">
      <div className="relative h-48 w-full lg:hidden">
        <Image src={heroSrc} alt={heroAlt} fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-cream via-brand-cream/20 to-transparent" />
      </div>

      <Container className="relative pb-14 pt-6 lg:max-w-none lg:px-0 lg:py-0">
        <div className="mx-auto grid min-h-[min(88vh,920px)] max-w-6xl overflow-hidden rounded-[2rem] border border-brand-espresso/10 bg-white shadow-lift lg:grid-cols-2 lg:rounded-3xl">
          <div className="relative flex flex-col justify-center px-4 py-8 sm:px-10 lg:px-12 lg:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-ember">{kicker}</p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-brand-espresso">{title}</h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-brand-espresso/65">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>

          <div className="relative hidden min-h-[420px] lg:block">
            <Image
              src={heroSrc}
              alt={heroAlt}
              fill
              className="object-cover"
              sizes="50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-charcoal/25 via-transparent to-brand-wine/35" />
            <p className="absolute bottom-8 left-8 max-w-xs font-display text-2xl font-medium leading-snug text-brand-cream drop-shadow-md">
              Cook with intention. Serve with style.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
