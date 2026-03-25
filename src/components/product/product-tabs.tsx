"use client";

import type { Product, Review } from "@/types/domain";
import { cn } from "@/lib/utils";
import { useState } from "react";

const tabs = [
  { id: "desc", label: "Description" },
  { id: "material", label: "Material" },
  { id: "care", label: "Care" },
  { id: "shipping", label: "Shipping & returns" },
  { id: "reviews", label: "Reviews" },
] as const;

export function ProductTabs({ product, reviews }: { product: Product; reviews: Review[] }) {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("desc");
  const reviewList = reviews;

  return (
    <div className="mt-12 border-t border-brand-espresso/10 pt-8">
      <div className="flex gap-2 overflow-x-auto pb-3" role="tablist" aria-label="Product details">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition",
              tab === t.id ? "border-brand-espresso bg-brand-espresso text-brand-cream" : "border-brand-espresso/15 bg-white text-brand-espresso/70"
            )}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="min-h-[8rem] rounded-2xl border border-brand-espresso/10 bg-white p-5 text-sm leading-relaxed text-brand-espresso/75">
        {tab === "desc" && (
          <div className="space-y-3">
            <p>{product.full_description || product.short_description || "A premium piece designed for daily elegance."}</p>
            {product.dimensions && (
              <p>
                <span className="font-semibold text-brand-espresso">Dimensions:</span> {product.dimensions}
              </p>
            )}
            {product.weight && (
              <p>
                <span className="font-semibold text-brand-espresso">Weight:</span> {product.weight}
              </p>
            )}
          </div>
        )}
        {tab === "material" && (
          <p>
            {product.material
              ? `Crafted from ${product.material.replace(/_/g, " ")} — balanced for heat response, longevity, and everyday joy.`
              : "Material details curated for performance and care — see packaging insert or message us on WhatsApp."}
          </p>
        )}
        {tab === "care" && <p>{product.care_instructions || "Hand wash warm; avoid abrasive pads on coated surfaces; dry thoroughly before storage."}</p>}
        {tab === "shipping" && <p>{product.shipping_info || "Accra-first delivery in 24–48h. Returns for defects or transit damage — contact support with photos within 48h."}</p>}
        {tab === "reviews" && (
          <div className="space-y-4">
            {reviewList.length === 0 && <p>No reviews yet — be the first after purchase.</p>}
            {reviewList.map((r) => (
              <div key={r.id} className="border-b border-brand-espresso/10 pb-3 last:border-0">
                <p className="text-xs font-semibold text-brand-espresso/55">
                  {r.author_name ?? "Customer"} · {r.rating}★
                </p>
                {r.title && <p className="mt-1 font-medium text-brand-espresso">{r.title}</p>}
                {r.body && <p className="mt-1">{r.body}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
