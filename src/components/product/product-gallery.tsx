"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { PLACEHOLDER_PRODUCT } from "@/lib/placeholders";
import type { ProductImage } from "@/types/domain";

export function ProductGallery({ images, productName }: { images: ProductImage[]; productName: string }) {
  const list = images.length ? images : [{ id: "p", url: PLACEHOLDER_PRODUCT, alt: productName, sort_order: 0, product_id: "" }];
  const [active, setActive] = useState(0);
  const main = list[active] ?? list[0]!;

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-brand-espresso/10 bg-brand-sand/20 shadow-soft">
        <Image
          key={main.id}
          src={main.url}
          alt={main.alt ?? productName}
          fill
          className="object-cover transition duration-500"
          sizes="(max-width:1024px) 100vw, 50vw"
          priority
        />
      </div>
      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {list.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border transition",
                i === active ? "border-brand-espresso ring-2 ring-brand-clay/30" : "border-brand-espresso/10 opacity-80 hover:opacity-100"
              )}
              aria-label={`Show image ${i + 1}`}
            >
              <Image src={img.url} alt="" fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
