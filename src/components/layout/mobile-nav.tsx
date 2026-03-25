"use client";

import Link from "next/link";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

export function MobileNav({
  open,
  onClose,
  nav,
  isAuthed,
}: {
  open: boolean;
  onClose: () => void;
  nav: { href: string; label: string }[];
  isAuthed: boolean;
}) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      id="mobile-menu"
      className={cn(
        "fixed inset-0 z-[55] bg-brand-charcoal/50 backdrop-blur-sm transition-opacity lg:hidden",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      )}
      aria-hidden={!open}
      onClick={onClose}
    >
      <div
        className={cn(
          "absolute right-0 top-0 z-10 flex h-full w-[min(100%,20rem)] flex-col bg-brand-cream shadow-lift transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-brand-espresso/10 px-4 py-4">
          <span className="font-display text-base">{BRAND.fullName}</span>
          <button
            type="button"
            className="min-h-10 min-w-10 rounded-full border border-brand-espresso/15 bg-white text-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-4" aria-label="Mobile">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-3 py-3 text-base font-medium text-brand-espresso transition-colors duration-200 hover:bg-white active:scale-[0.99]"
              onClick={onClose}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/search"
            className="rounded-xl px-3 py-3 text-base font-medium text-brand-espresso transition-colors duration-200 hover:bg-white active:scale-[0.99]"
            onClick={onClose}
          >
            Search
          </Link>
          <Link
            href="/wishlist"
            className="rounded-xl px-3 py-3 text-base font-medium text-brand-espresso transition-colors duration-200 hover:bg-white active:scale-[0.99]"
            onClick={onClose}
          >
            Wishlist
          </Link>
          <Link
            href="/account"
            className="rounded-xl px-3 py-3 text-base font-medium text-brand-espresso transition-colors duration-200 hover:bg-white active:scale-[0.99]"
            onClick={onClose}
          >
            {isAuthed ? "Account" : "Sign in"}
          </Link>
          {!isAuthed && (
            <Link
              href="/auth/signup"
              className="rounded-xl bg-brand-espresso px-3 py-3 text-base font-semibold text-brand-cream transition-colors duration-200 hover:bg-brand-charcoal active:scale-[0.99]"
              onClick={onClose}
            >
              Create account
            </Link>
          )}
        </nav>
        <div className="border-t border-brand-espresso/10 p-4 text-xs text-brand-espresso/60">
          {BRAND.tagline}
        </div>
      </div>
    </div>
  );
}
