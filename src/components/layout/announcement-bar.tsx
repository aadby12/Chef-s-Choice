import Link from "next/link";
import { BRAND } from "@/lib/brand";

export function AnnouncementBar() {
  return (
    <div
      className="flex h-10 w-full shrink-0 items-center justify-center gap-2 border-b border-black/10 bg-brand-espresso px-4 text-center text-[11px] text-brand-cream sm:text-xs"
      role="region"
      aria-label="Announcement"
    >
      <span className="font-medium">24–48h delivery across Accra</span>
      <span className="hidden opacity-60 sm:inline">·</span>
      <Link href="/contact" className="hidden underline-offset-2 hover:underline sm:inline">
        WhatsApp {BRAND.phoneDisplay}
      </Link>
    </div>
  );
}
