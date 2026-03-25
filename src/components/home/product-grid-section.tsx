import Link from "next/link";
import type { Product } from "@/types/domain";
import { ProductCard } from "@/components/product/product-card";
import { Container } from "@/components/layout/container";

export function ProductGridSection({
  title,
  subtitle,
  products,
  href,
  linkLabel,
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  href: string;
  linkLabel: string;
}) {
  return (
    <section className="relative overflow-hidden border-y border-brand-espresso/10 py-16 sm:py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-brand-mist/30 to-white/85" aria-hidden />
      <div className="pointer-events-none absolute -left-20 top-8 h-44 w-44 rounded-full bg-brand-gold/10 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-brand-terracotta/10 blur-3xl" aria-hidden />
      <Container className="relative">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-ember">{subtitle}</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-brand-espresso sm:text-[2.15rem]">
              {title}
            </h2>
            <div className="mt-3 h-px w-12 rounded-full bg-gradient-to-r from-brand-gold to-brand-terracotta/60" aria-hidden />
          </div>
          <Link href={href} className="text-sm font-medium text-brand-terracotta hover:underline">
            {linkLabel}
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Container>
    </section>
  );
}
