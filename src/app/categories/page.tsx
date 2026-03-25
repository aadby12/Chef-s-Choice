import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { getCategories } from "@/lib/data/catalog";
import { PLACEHOLDER_LIFESTYLE } from "@/lib/placeholders";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await getCategories();
  return (
    <Container className="pb-20">
      <h1 className="font-display text-3xl text-brand-espresso sm:text-4xl">Collections</h1>
      <p className="mt-3 max-w-2xl text-sm text-brand-espresso/70">
        Explore cookware families — from everyday non-stick ease to cast iron ceremony.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/categories/${c.slug}`}
            className="group overflow-hidden rounded-2xl border border-brand-espresso/10 bg-white shadow-sm"
          >
            <div className="relative aspect-[16/10] bg-brand-sand/30">
              <Image
                src={c.image_url || PLACEHOLDER_LIFESTYLE}
                alt={c.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.02]"
                sizes="33vw"
              />
            </div>
            <div className="p-5">
              <h2 className="font-display text-xl text-brand-espresso">{c.name}</h2>
              {c.is_future_collection && (
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-brand-clay">Coming soon</p>
              )}
              {c.description && <p className="mt-2 line-clamp-2 text-sm text-brand-espresso/65">{c.description}</p>}
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
