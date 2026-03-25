import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types/domain";
import { PLACEHOLDER_LIFESTYLE } from "@/lib/placeholders";
import { Container } from "@/components/layout/container";

export function FeaturedCategories({ categories }: { categories: Category[] }) {
  const main = categories.filter((c) => !c.is_future_collection).slice(0, 6);
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-mist/45 to-transparent" aria-hidden />
      <Container>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-ember">Collections</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-brand-espresso sm:text-[2.15rem]">
              Shop by craft & material
            </h2>
            <div className="mt-3 h-px w-12 rounded-full bg-gradient-to-r from-brand-gold to-brand-terracotta/60" aria-hidden />
          </div>
          <Link href="/categories" className="text-sm font-medium text-brand-terracotta hover:underline">
            View all collections
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {main.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-brand-espresso/10 bg-white shadow-soft ring-1 ring-brand-espresso/[0.04] transition duration-300 hover:-translate-y-1 hover:border-brand-gold/40 hover:shadow-lift"
            >
              <div className="relative aspect-[16/11] bg-brand-sand/30">
                <Image
                  src={cat.image_url || PLACEHOLDER_LIFESTYLE}
                  alt={cat.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.05]"
                  sizes="(max-width:1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/80 via-brand-charcoal/25 to-transparent opacity-90 transition group-hover:opacity-95" />
                <div className="absolute bottom-0 left-0 p-5 text-brand-cream">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-gold/90">Collection</p>
                  <h3 className="font-display text-xl font-semibold tracking-tight drop-shadow-sm">{cat.name}</h3>
                  {cat.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-brand-cream/80">{cat.description}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
