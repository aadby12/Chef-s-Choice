import Image from "next/image";
import { Container } from "@/components/layout/container";
import { BRAND } from "@/lib/brand";
import { PLACEHOLDER_LIFESTYLE } from "@/lib/placeholders";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <Container className="pb-24">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-espresso/45">{BRAND.fullName}</p>
      <h1 className="mt-3 max-w-3xl font-display text-4xl text-brand-espresso sm:text-5xl">
        Elevating the joy of cooking
      </h1>
      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-brand-espresso/75">
        Maison Solange is a home lifestyle house rooted in Accra — offering premium cookware that feels as confident as it
        looks. We believe beautiful tools invite better rituals: slower mornings, braver flavors, warmer gatherings.
      </p>
      <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-brand-sand/30">
          <Image src={PLACEHOLDER_LIFESTYLE} alt="Kitchen ritual" fill className="object-cover" sizes="50vw" />
        </div>
        <div className="space-y-4 text-sm leading-relaxed text-brand-espresso/75">
          <p>
            Our debut line, <strong className="text-brand-espresso">{BRAND.name}</strong>, is intentionally edited —
            stainless steel for professional standards, non-stick ceramics for everyday ease, cast iron for the sear you
            can hear from the hallway.
          </p>
          <p>
            We design for young professionals, home cooks, creators, newlyweds, and the hosts of elevated short-lets —
            people who treat the kitchen as the soul of the home.
          </p>
          <p>
            Tableware, a broader home collection, and a bakeware atelier are on our roadmap — each release framed with
            the same editorial care and performance standards.
          </p>
        </div>
      </div>
    </Container>
  );
}
