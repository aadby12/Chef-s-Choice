import Image from "next/image";
import Link from "next/link";
import { BRAND, MATERIAL_OPTIONS } from "@/lib/brand";
import { CATALOG_MEDIA, INSTAGRAM_GRID } from "@/lib/catalog-local-images";
import { Container } from "@/components/layout/container";

export function BrandStory() {
  return (
    <section className="relative py-16 sm:py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-mist/80 via-transparent to-brand-sand/40" aria-hidden />
      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 lg:items-center">
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
      title: "Thoughtful materials",
      body: "From stainless steel standards to ceramic ease and cast iron longevity — every piece is chosen for real kitchens.",
    },
    {
      title: "Editorial design language",
      body: "Warm minimalism that photographs beautifully and feels calm on the countertop.",
    },
    {
      title: "Accra logistics, boutique care",
      body: "Fast local delivery with human support on WhatsApp when you want a second opinion.",
    },
  ];
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-ember">Why choose us</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-brand-espresso sm:text-4xl">
          Confidence you can feel
        </h2>
        <div className="mt-4 h-px w-14 rounded-full bg-gradient-to-r from-brand-gold to-brand-terracotta/50" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((it) => (
            <article
              key={it.title}
              className="relative overflow-hidden rounded-2xl border border-brand-espresso/10 bg-white/80 p-7 shadow-soft ring-1 ring-brand-gold/10 backdrop-blur-sm transition hover:shadow-lift"
            >
              <div className="absolute right-4 top-4 h-10 w-10 rounded-full bg-brand-gold/10" aria-hidden />
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
    <section className="border-y border-brand-espresso/10 bg-white/50 py-16 sm:py-24">
      <Container>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-ember">Education</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-brand-espresso sm:text-4xl">
          Shop by material
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-brand-espresso/70">
          Different metals and coatings behave differently — we help you choose what matches how you cook, clean, and
          entertain.
        </p>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
      <Container className="relative py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-3">
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
    <section className="relative py-24 sm:py-32">
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
    <section className="py-16 sm:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] border border-brand-espresso/10 bg-white/70 p-8 shadow-lift ring-1 ring-brand-gold/15 backdrop-blur-md sm:p-14">
          <div className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-brand-terracotta/10 blur-3xl" aria-hidden />
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-ember">Launch offer</p>
          <h2 className="mt-4 max-w-xl font-display text-3xl font-semibold tracking-tight text-brand-espresso sm:text-4xl">
            Build your essentials bundle
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-brand-espresso/70">
            Curated trios for searing, simmering, and serving — use code <span className="font-mono font-semibold text-brand-wine">WELCOME10</span>{" "}
            at checkout when coupons are wired (see Admin).
          </p>
          <Link
            href="/shop?featured=1"
            className="mt-10 inline-flex rounded-full bg-brand-espresso px-8 py-3 text-sm font-semibold text-brand-cream shadow-soft transition hover:bg-brand-charcoal"
          >
            Shop featured
          </Link>
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
    <section className="py-12">
      <Container>
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl text-brand-espresso">On the table</h2>
          <a href={BRAND.social.instagram} target="_blank" rel="noreferrer" className="text-sm font-medium text-brand-terracotta hover:underline">
            Follow {BRAND.name}
          </a>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
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
