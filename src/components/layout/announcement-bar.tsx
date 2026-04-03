import Link from "next/link";
import { BRAND } from "@/lib/brand";

/** Single top strip so delivery / trust / WhatsApp are not repeated under the header. */
export function AnnouncementBar() {
  return (
    <div
      className="flex min-h-10 w-full shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-white/10 bg-brand-charcoal px-4 py-2 text-[11px] text-brand-cream sm:px-6"
      role="region"
      aria-label="Store updates"
    >
      <p className="font-medium tracking-wide text-brand-cream/90">
        24–48h dispatch in {BRAND.city}
        <span className="text-brand-cream/45"> · </span>
        Paystack-secured checkout
      </p>
      <div className="flex items-center gap-3 sm:gap-4">
        <a
          href={`https://wa.me/${BRAND.whatsappE164}`}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-brand-gold/95 underline-offset-4 hover:text-brand-gold hover:underline"
        >
          WhatsApp us
        </a>
        <span className="hidden text-brand-cream/30 sm:inline" aria-hidden>
          |
        </span>
        <Link href="/contact" className="text-brand-cream/80 underline-offset-4 hover:text-brand-cream hover:underline">
          Contact
        </Link>
      </div>
    </div>
  );
}
