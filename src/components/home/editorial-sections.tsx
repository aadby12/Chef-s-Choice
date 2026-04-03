import Image from "next/image";
import Link from "next/link";
import { BRAND, MATERIAL_OPTIONS } from "@/lib/brand";
import { CATALOG_MEDIA, INSTAGRAM_GRID } from "@/lib/catalog-local-images";
import { Container } from "@/components/layout/container";

export function BrandStory() {
  return (
    <section className="relative py-12 sm:py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-mist/80 via-transparent to-brand-sand/40" aria-hidden />
      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 lg:items-center">
          <div className="group relative">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-tr from-brand-gold/20 via-transparent to-brand-terracotta/15 blur-xl transition group-hover:opacity-90" aria-hidden />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-brand-sand/30 shadow-lift ring-1 ring-brand-espresso/10">
              <Image
                src={CATALOG_MEDIA.editorialKitchen}
                alt="Curated kitchen tableau"
                fill
                className="object-cover transition duration-700 group-hover:scale-[1.03]"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-ember">Maison Solange</p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-brand-espresso sm:text-4xl lg:text-[2.6rem]">
              Elegant performance for modern homes
            </h2>
            <div className="mt-4 h-px w-14 rounded-full bg-gradient-to-r from-brand-gold to-brand-terracotta/50" />
            <p className="mt-6 text-sm leading-relaxed text-brand-espresso/75">
              {BRAND.fullName} celebrates the ritual of cooking — the steam, the sear, the quiet confidence of tools that
              feel as beautiful as they are capable. We design for young professionals, thoughtful hosts, and anyone
              building a kitchen that reflects how they live.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-brand-espresso/75">
              Born in Accra with global ambition, we pair premium materials with approachable care — so your cookware
              lasts, ages gracefully, and earns a permanent place on the stovetop.
            </p>
            <Link
              href="/about"
              className="mt-10 inline-flex rounded-full border border-brand-espresso/15 bg-white px-6 py-2.5 text-sm font-semibold text-brand-espresso shadow-sm transition hover:border-brand-gold/50 hover:shadow-soft"
            >
              Read our story
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function WhyChooseUs() {
  const items = [
    {
      title: "Premium selection",
      body: "From stainless steel staples to ceramic ease and cast iron longevity, every piece is chosen to earn its place in a real home.",
    },
    {
      title: "Shopping made simple",
      body: "Clear categories, polished product pages, and direct support help you find the right cookware faster.",
    },
    {
      title: "Accra-based support",
      body: "Fast local delivery with human WhatsApp guidance whenever you want a second opinion before checkout.",
    },
  ];
  return (
    <section className="border-y border-brand-espresso/10 bg-brand-mist/20 py-10 sm:py-14">
      <Container>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-ember">Why shop with us</p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-brand-espresso sm:text-4xl">
          A cleaner, more confident way to shop premium cookware
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {items.map((it) => (
            <article
              key={it.title}
              className="relative overflow-hidden rounded-[1.7rem] border border-brand-espresso/10 bg-white p-7 shadow-soft ring-1 ring-brand-espresso/[0.04] transition hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="absolute right-5 top-5 text-3xl font-display text-brand-gold/25" aria-hidden>
                0{items.indexOf(it) + 1}
              </div>
              <h3 className="font-display text-xl font-semibold text-brand-espresso">{it.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-espresso/70">{it.body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function ShopByMaterial() {
  return (
    <section className="border-y border-brand-espresso/10 bg-white/50 py-12 sm:py-20">
      <Container>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-ember">Education</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-brand-espresso sm:text-4xl">
          Shop by material
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-brand-espresso/70">
          Different metals and coatings behave differently — we help you choose what matches how you cook, clean, and
          entertain.
        </p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MATERIAL_OPTIONS.map((m) => (
            <Link
              key={m.value}
              href={`/shop?material=${encodeURIComponent(m.value)}`}
              className="rounded-2xl border border-brand-espresso/10 bg-gradient-to-br from-white to-brand-mist/40 px-4 py-4 text-sm font-semibold text-brand-espresso shadow-sm ring-1 ring-brand-espresso/[0.06] transition hover:border-brand-gold/35 hover:shadow-lift"
            >
              {m.label}
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function EducationStrip() {
  return (
    <section className="relative overflow-hidden border-y border-brand-wine/20 bg-gradient-to-br from-brand-espresso via-brand-charcoal to-brand-wine/90 text-brand-cream">
      <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-brand-gold/15 blur-3xl" aria-hidden />
      <Container className="relative py-10 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div>
            <h3 className="font-display text-xl font-semibold">Care that extends life</h3>
            <p className="mt-2 text-sm text-brand-cream/75">
              Season cast iron & carbon steel thoughtfully; avoid thermal shock on ceramics; polish copper with intention.
            </p>
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold">The right tool, the right heat</h3>
            <p className="mt-2 text-sm text-brand-cream/75">
              Stainless for fond and fond-based sauces; non-stick for eggs; cast iron for an even, steady sear.
            </p>
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold">Designed for growth</h3>
            <p className="mt-2 text-sm text-brand-cream/75">
              Tableware, home accents, and a bakeware atelier are on the horizon — start with cookware you trust.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function LifestyleBand() {
  return (
    <section className="relative py-16 sm:py-24">
      <div className="absolute inset-0">
        <Image src={CATALOG_MEDIA.wokFlames} alt="" fill className="object-cover" sizes="100vw" priority={false} />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal/85 via-brand-charcoal/65 to-brand-charcoal/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/70 to-transparent" />
      </div>
      <Container className="relative max-w-3xl text-center text-brand-cream">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-gold/90">Kitchen lifestyle</p>
        <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          For hosts, creators, and quiet weeknight rituals
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-brand-cream/85 sm:text-base">
          Short-let perfection. Newlywed nest-building. The first dinner party that actually feels effortless.
        </p>
        <Link
          href="/shop?bestseller=1"
          className="mt-10 inline-flex rounded-full bg-brand-gold px-8 py-3 text-sm font-semibold text-brand-charcoal transition hover:bg-[#d4ad32]"
        >
          Shop the feeling
        </Link>
      </Container>
    </section>
  );
}

export function BundlePromo() {
  return (
    <section className="py-12 sm:py-14">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] border border-brand-espresso/10 bg-brand-charcoal p-6 text-brand-cream shadow-lift sm:p-10">
          <div className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-brand-gold/15 blur-3xl" aria-hidden />
          <div className="grid gap-6 lg:grid-cols-[1fr_0.55fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold/90">Featured bundle</p>
              <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Build a kitchen starter set with best-selling essentials.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-cream/72">
                Start with high-performing everyday pieces, add serving favorites, and create a collection that feels polished from stovetop to table.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/shop?featured=1"
                  className="inline-flex rounded-full bg-brand-gold px-8 py-3 text-sm font-semibold text-brand-charcoal transition hover:bg-[#d4ad32]"
                >
                  Shop the collection
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex rounded-full border border-white/15 px-8 py-3 text-sm font-semibold text-brand-cream transition hover:bg-white/8"
                >
                  View all products
                </Link>
              </div>
            </div>
            <div className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm text-brand-cream/80">
              <p>Professional-grade finishes for everyday use.</p>
              <p>Mix hero cookware with tabletop and serving pieces.</p>
              <p>Ideal for first homes, gifting, and kitchen refreshes.</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function WhatsappCta() {
  return (
    <section className="pb-4">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-brand-espresso/10 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:p-8">
          <div>
            <h2 className="font-display text-2xl text-brand-espresso">Prefer WhatsApp?</h2>
            <p className="mt-2 text-sm text-brand-espresso/70">
              Send your cart, ask about materials, or arrange COD — a human replies during dispatch hours.
            </p>
          </div>
          <a
            href={`https://wa.me/${BRAND.whatsappE164}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-sage px-8 text-sm font-semibold text-white hover:opacity-95"
          >
            Chat on WhatsApp
          </a>
        </div>
      </Container>
    </section>
  );
}

export function InstagramStrip() {
  return (
    <section className="py-8 sm:py-10">
      <Container>
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl text-brand-espresso">On the table</h2>
          <a href={BRAND.social.instagram} target="_blank" rel="noreferrer" className="text-sm font-medium text-brand-terracotta hover:underline">
            Follow {BRAND.name}
          </a>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {INSTAGRAM_GRID.map((src, i) => (
            <div
              key={i}
              className="group relative aspect-square overflow-hidden rounded-xl bg-brand-sand/40 ring-1 ring-brand-espresso/10 transition hover:ring-brand-gold/40"
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover opacity-95 transition duration-500 group-hover:scale-105"
                sizes="25vw"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
