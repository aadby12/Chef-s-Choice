"use client";

import type { Category } from "@/types/domain";
import { MATERIAL_OPTIONS } from "@/lib/brand";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const selectClass =
  "min-h-10 w-full cursor-pointer rounded-xl border border-brand-espresso/10 bg-white px-3 text-sm shadow-sm " +
  "focus:border-brand-clay focus:outline-none focus:ring-2 focus:ring-brand-clay/25";

function buildShopHref(current: URLSearchParams, patch: Record<string, string | undefined | null>) {
  const next = new URLSearchParams(current.toString());
  for (const [k, v] of Object.entries(patch)) {
    if (v === null || v === undefined || v === "") next.delete(k);
    else next.set(k, v);
  }
  next.delete("page");
  const q = next.toString();
  return q ? `/shop?${q}` : "/shop";
}

export function ShopFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const sp = useSearchParams();
  const spStr = sp.toString();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const extraCount = useMemo(() => {
    let n = 0;
    if (sp.get("category")) n++;
    if (sp.get("material")) n++;
    if (sp.get("minPrice")) n++;
    if (sp.get("maxPrice")) n++;
    if (sp.get("inStock") === "1") n++;
    if (sp.get("featured") === "1") n++;
    if (sp.get("bestseller") === "1") n++;
    return n;
  }, [sp]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const el = panelRef.current;
      if (el && !el.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const applyForm = useCallback(
    (form: FormData) => {
      const params = new URLSearchParams(sp.toString());
      const q = String(form.get("q") ?? "").trim();
      const category = String(form.get("category") ?? "");
      const material = String(form.get("material") ?? "");
      const minPrice = String(form.get("minPrice") ?? "");
      const maxPrice = String(form.get("maxPrice") ?? "");
      const sort = String(form.get("sort") ?? params.get("sort") ?? "newest");
      const inStock = form.get("inStock") === "on";
      const featured = form.get("featured") === "on";
      const bestSeller = form.get("bestSeller") === "on";

      if (q) params.set("q", q);
      else params.delete("q");
      if (category) params.set("category", category);
      else params.delete("category");
      if (material) params.set("material", material);
      else params.delete("material");
      if (minPrice) params.set("minPrice", minPrice);
      else params.delete("minPrice");
      if (maxPrice) params.set("maxPrice", maxPrice);
      else params.delete("maxPrice");
      if (sort) params.set("sort", sort);
      if (inStock) params.set("inStock", "1");
      else params.delete("inStock");
      if (featured) params.set("featured", "1");
      else params.delete("featured");
      if (bestSeller) params.set("bestseller", "1");
      else params.delete("bestseller");
      params.delete("page");
      const qs = params.toString();
      router.push(qs ? `/shop?${qs}` : "/shop");
      setOpen(false);
    },
    [router, sp]
  );

  const applyQuickSearch = useCallback(
    (qRaw: string) => {
      const q = qRaw.trim();
      router.push(buildShopHref(sp, { q: q || null }));
    },
    [router, sp]
  );

  const onSortChange = (sort: string) => {
    router.push(buildShopHref(sp, { sort }));
  };

  return (
    <div ref={panelRef} className="relative z-30 mb-8">
      <div className="flex flex-col gap-3 rounded-2xl border border-brand-espresso/10 bg-white/90 p-3 shadow-soft backdrop-blur-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
        <form
          className="flex min-w-0 flex-1 items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            applyQuickSearch(String(fd.get("q") ?? ""));
          }}
        >
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-espresso/35" aria-hidden>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-4.3-4.3" />
              </svg>
            </span>
            <Input
              name="q"
              defaultValue={sp.get("q") ?? ""}
              placeholder="Search name or SKU…"
              className="h-10 rounded-full border-brand-espresso/10 pl-9 text-sm"
              aria-label="Search products"
            />
          </div>
          <Button type="submit" variant="primary" size="sm" className="shrink-0 rounded-full px-5">
            Search
          </Button>
        </form>

        <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
          <label className="sr-only" htmlFor="shop-sort">
            Sort
          </label>
          <select
            id="shop-sort"
            value={sp.get("sort") ?? "newest"}
            onChange={(e) => onSortChange(e.target.value)}
            className={cn(selectClass, "min-w-[10.5rem] rounded-full")}
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price ↑</option>
            <option value="price_desc">Price ↓</option>
            <option value="popular">Popular</option>
          </select>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition",
              open
                ? "border-brand-espresso bg-brand-espresso text-brand-cream shadow-soft"
                : "border-brand-espresso/15 bg-brand-cream text-brand-espresso hover:border-brand-gold/45 hover:bg-white"
            )}
            aria-expanded={open}
            aria-haspopup="dialog"
          >
            Filters
            {extraCount > 0 && (
              <span
                className={cn(
                  "flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px]",
                  open ? "bg-brand-cream text-brand-espresso" : "bg-brand-terracotta text-white"
                )}
              >
                {extraCount}
              </span>
            )}
            <svg
              viewBox="0 0 24 24"
              className={cn("h-4 w-4 transition-transform duration-200", open && "rotate-180")}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div
        className={cn(
          "absolute left-0 right-0 mt-2 origin-top transition-all duration-200 ease-out sm:left-auto sm:right-0 sm:w-[min(100vw-2rem,28rem)]",
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-1 scale-[0.98] opacity-0"
        )}
        role="dialog"
        aria-label="Filter products"
        aria-hidden={!open}
      >
        <div className="rounded-2xl border border-brand-espresso/10 bg-white p-5 shadow-lift ring-1 ring-brand-gold/10">
          <form
            key={spStr}
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              applyForm(new FormData(e.currentTarget));
            }}
          >
            <input type="hidden" name="q" value={sp.get("q") ?? ""} readOnly />
            <input type="hidden" name="sort" value={sp.get("sort") ?? "newest"} readOnly />

            <div>
              <Label htmlFor="flt-cat" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-espresso/55">
                Collection
              </Label>
              <select
                id="flt-cat"
                name="category"
                defaultValue={sp.get("category") ?? ""}
                className={cn(selectClass, "mt-1.5")}
              >
                <option value="">All</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="flt-mat" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-espresso/55">
                Material
              </Label>
              <select
                id="flt-mat"
                name="material"
                defaultValue={sp.get("material") ?? ""}
                className={cn(selectClass, "mt-1.5")}
              >
                <option value="">All</option>
                {MATERIAL_OPTIONS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="flt-min" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-espresso/55">
                  Min GH₵
                </Label>
                <Input
                  id="flt-min"
                  name="minPrice"
                  type="number"
                  min={0}
                  defaultValue={sp.get("minPrice") ?? ""}
                  className="mt-1.5 h-10 rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="flt-max" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-espresso/55">
                  Max GH₵
                </Label>
                <Input
                  id="flt-max"
                  name="maxPrice"
                  type="number"
                  min={0}
                  defaultValue={sp.get("maxPrice") ?? ""}
                  className="mt-1.5 h-10 rounded-xl"
                />
              </div>
            </div>

            <fieldset>
              <legend className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-espresso/55">Narrow</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                <label className="inline-flex cursor-pointer rounded-full">
                  <input type="checkbox" name="inStock" defaultChecked={sp.get("inStock") === "1"} className="peer sr-only" />
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                      "border-brand-espresso/15 bg-brand-cream text-brand-espresso",
                      "peer-checked:border-brand-espresso peer-checked:bg-brand-espresso peer-checked:text-brand-cream"
                    )}
                  >
                    In stock
                  </span>
                </label>
                <label className="inline-flex cursor-pointer rounded-full">
                  <input type="checkbox" name="featured" defaultChecked={sp.get("featured") === "1"} className="peer sr-only" />
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                      "border-brand-espresso/15 bg-brand-cream text-brand-espresso",
                      "peer-checked:border-brand-espresso peer-checked:bg-brand-espresso peer-checked:text-brand-cream"
                    )}
                  >
                    Featured
                  </span>
                </label>
                <label className="inline-flex cursor-pointer rounded-full">
                  <input type="checkbox" name="bestSeller" defaultChecked={sp.get("bestseller") === "1"} className="peer sr-only" />
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                      "border-brand-espresso/15 bg-brand-cream text-brand-espresso",
                      "peer-checked:border-brand-espresso peer-checked:bg-brand-espresso peer-checked:text-brand-cream"
                    )}
                  >
                    Best sellers
                  </span>
                </label>
              </div>
            </fieldset>

            <div className="flex gap-2 border-t border-brand-espresso/10 pt-4">
              <Button type="submit" variant="primary" size="sm" className="flex-1">
                Apply
              </Button>
              <Button type="button" variant="outline" size="sm" className="flex-1" onClick={() => router.push("/shop")}>
                Reset
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
