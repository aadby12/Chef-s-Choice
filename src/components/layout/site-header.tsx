"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useCart } from "@/lib/hooks/use-cart";
import { useWishlist } from "@/lib/hooks/use-wishlist";
import { MobileNav } from "@/components/layout/mobile-nav";

const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Collections" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { count } = useCart();
  const { ids } = useWishlist();
  const [open, setOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    try {
      const supabase = createSupabaseBrowserClient();
      supabase.auth.getSession().then(({ data }) => {
        setIsAuthed(Boolean(data.session));
      });
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsAuthed(Boolean(session));
      });
      return () => data.subscription.unsubscribe();
    } catch {
      setIsAuthed(false);
      return;
    }
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-brand-espresso/10 bg-brand-cream/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[3.75rem] max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group flex flex-col leading-tight transition duration-200 ease-out hover:opacity-90 active:scale-[0.98]"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-ember">
              Maison Solange
            </span>
            <span className="mt-0.5 font-display text-xl tracking-tight text-brand-espresso sm:text-2xl">
              {BRAND.name}
            </span>
            <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-brand-espresso/45">
              Curated cookware and kitchenware
            </span>
          </Link>

          <nav className="hidden items-center gap-7 xl:flex" aria-label="Primary">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-sm font-medium text-brand-espresso/70 transition-colors duration-200 ease-out",
                  "hover:text-brand-espresso",
                  pathname === item.href && "text-brand-espresso"
                )}
              >
                {item.label}
                {pathname === item.href && (
                  <span className="absolute -bottom-2 left-0 h-px w-full bg-brand-espresso" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <form action="/search" method="get" className="hidden items-center gap-2 lg:flex">
              <input
                name="q"
                placeholder="Search cookware"
                className="h-10 w-40 rounded-full border border-brand-espresso/10 bg-white px-4 text-sm shadow-sm focus:border-brand-clay focus:outline-none focus:ring-2 focus:ring-brand-clay/25 xl:w-52"
                aria-label="Search products"
              />
            </form>
            <Link
              href="/wishlist"
              className="relative hidden min-h-10 min-w-10 items-center justify-center rounded-full border border-brand-espresso/10 bg-white text-sm font-medium shadow-sm transition duration-200 hover:border-brand-gold/40 hover:shadow-md active:scale-95 sm:flex"
              aria-label="Wishlist"
            >
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 20.2c-5.8-3.5-9-6.5-9-10a5.2 5.2 0 0 1 9-3.5 5.2 5.2 0 0 1 9 3.5c0 3.5-3.2 6.5-9 10Z" />
              </svg>
              {ids.size > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-terracotta px-1 text-[10px] text-white">
                  {ids.size}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="relative flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-brand-espresso/10 bg-white px-3.5 text-sm font-semibold shadow-sm transition duration-200 hover:border-brand-gold/40 hover:shadow-md active:scale-95"
              aria-label="Cart"
            >
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 8.5h16l-1.3 10.1a2 2 0 0 1-2 1.7H7.3a2 2 0 0 1-2-1.7L4 8.5Z" />
                <path d="M8.5 8.5V7a3.5 3.5 0 0 1 7 0v1.5" />
              </svg>
              <span className="hidden sm:inline">Bag</span>
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-espresso px-1 text-[10px] text-brand-cream">
                  {count}
                </span>
              )}
            </Link>
            {isAuthed ? (
              <Link
                href="/account"
                className={cn(
                  "hidden min-h-10 items-center justify-center gap-2 rounded-full border border-brand-espresso/15",
                  "bg-brand-cream px-4 text-sm font-medium text-brand-espresso transition duration-200 hover:border-brand-gold/35 hover:bg-white hover:shadow-sm active:scale-95 xl:inline-flex"
                )}
              >
                <svg viewBox="0 0 24 24" className="h-[16px] w-[16px]" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M5 20a7 7 0 0 1 14 0" />
                </svg>
                Account
              </Link>
            ) : (
              <div className="hidden items-center gap-2 xl:flex">
                <Link
                  href="/auth/login"
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-brand-espresso/15 bg-white px-4 text-sm font-medium text-brand-espresso transition duration-200 hover:border-brand-gold/35 hover:bg-brand-mist/40 active:scale-95"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex min-h-10 items-center justify-center rounded-full bg-brand-espresso px-4 text-sm font-semibold text-brand-cream transition duration-200 hover:bg-brand-charcoal hover:shadow-md active:scale-95"
                >
                  Sign up
                </Link>
              </div>
            )}
            <button
              type="button"
              className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-brand-espresso/15 bg-white text-lg lg:hidden"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              Menu
            </button>
          </div>
        </div>
      </header>
      <MobileNav open={open} onClose={() => setOpen(false)} nav={nav} isAuthed={Boolean(isAuthed)} />
    </>
  );
}
