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
    <section className="relative overflow-hidden py-12 sm:py-16">
      <Container className="relative">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-ember">{subtitle}</p>
            <h2 className="mt-1.5 font-display text-3xl font-semibold tracking-tight text-brand-espresso sm:text-[2.15rem]">
              {title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-brand-espresso/65">
              Handpicked pieces designed to make shopping faster, easier, and more inspiring.
            </p>
          </div>
          <Link href={href} className="text-sm font-medium text-brand-terracotta hover:underline">
            {linkLabel}
          </Link>
        </div>
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Container>
    </section>
  );
}
