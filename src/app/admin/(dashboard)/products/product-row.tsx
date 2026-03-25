"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useMemo, useState } from "react";
import { deleteProduct, updateProduct, type ProductActionState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatGhs } from "@/lib/utils";
import { AdminProductImageField } from "./admin-product-image-field";

type Img = { url: string; alt: string | null; sort_order: number };

export type AdminProductRow = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number | string;
  compare_at_price: number | string | null;
  stock: number;
  short_description: string | null;
  full_description: string | null;
  material: string | null;
  dimensions: string | null;
  weight: string | null;
  care_instructions: string | null;
  shipping_info: string | null;
  tags: string[] | null;
  featured: boolean;
  best_seller: boolean;
  category_id: string | null;
  product_images?: Img[] | null;
};

const initial: ProductActionState = {};

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" size="sm" disabled={pending}>
      {pending ? "Saving…" : "Save product"}
    </Button>
  );
}

export function ProductRow({
  p,
  categories,
}: {
  p: AdminProductRow;
  categories: { id: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [updateState, updateAction] = useFormState(updateProduct, initial);
  const [deleteState, deleteAction] = useFormState(deleteProduct, initial);

  const primary = useMemo(() => {
    const imgs = p.product_images ?? [];
    return [...imgs].sort((a, b) => a.sort_order - b.sort_order)[0];
  }, [p.product_images]);

  const priceNum = Number(p.price);
  const compareNum = p.compare_at_price != null ? Number(p.compare_at_price) : null;
  const tagsStr = (p.tags ?? []).join(", ");

  return (
    <>
      <tr className="border-b border-brand-espresso/5 align-top">
        <td className="px-4 py-3 font-medium text-brand-espresso">{p.name}</td>
        <td className="px-4 py-3 font-mono text-xs">{p.sku}</td>
        <td className="px-4 py-3">{formatGhs(priceNum)}</td>
        <td className="px-4 py-3">{p.stock}</td>
        <td className="px-4 py-3 text-xs text-brand-espresso/60">
          {p.featured && "Featured "}
          {p.best_seller && "Best seller"}
        </td>
        <td className="px-4 py-3">
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen((v) => !v)}>
              {open ? "Close" : "Edit"}
            </Button>
            <form action={deleteAction} className="inline">
              <input type="hidden" name="id" value={p.id} />
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="border-brand-terracotta/40 text-brand-terracotta hover:bg-brand-terracotta/10"
                onClick={(e) => {
                  if (!confirm(`Delete product “${p.name}”? This removes reviews and images.`)) {
                    e.preventDefault();
                  }
                }}
              >
                Delete
              </Button>
            </form>
          </div>
          {deleteState?.error && <p className="mt-1 text-xs text-brand-terracotta">{deleteState.error}</p>}
        </td>
      </tr>
      {open && (
        <tr className="border-b border-brand-espresso/10 bg-brand-mist/20">
          <td colSpan={6} className="px-4 py-6">
            <form action={updateAction} className="space-y-4">
              <input type="hidden" name="id" value={p.id} />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor={`p-name-${p.id}`}>Name</Label>
                  <Input id={`p-name-${p.id}`} name="name" required defaultValue={p.name} />
                </div>
                <div>
                  <Label htmlFor={`p-slug-${p.id}`}>Slug</Label>
                  <Input id={`p-slug-${p.id}`} name="slug" required defaultValue={p.slug} />
                </div>
                <div>
                  <Label htmlFor={`p-sku-${p.id}`}>SKU</Label>
                  <Input id={`p-sku-${p.id}`} name="sku" required defaultValue={p.sku} />
                </div>
                <div>
                  <Label htmlFor={`p-price-${p.id}`}>Price (GHS)</Label>
                  <Input
                    id={`p-price-${p.id}`}
                    name="price"
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min={0}
                    required
                    defaultValue={priceNum}
                  />
                </div>
                <div>
                  <Label htmlFor={`p-compare-${p.id}`}>Compare-at</Label>
                  <Input
                    id={`p-compare-${p.id}`}
                    name="compare_at_price"
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min={0}
                    defaultValue={compareNum ?? ""}
                  />
                </div>
                <div>
                  <Label htmlFor={`p-stock-${p.id}`}>Stock</Label>
                  <Input id={`p-stock-${p.id}`} name="stock" type="number" min={0} defaultValue={p.stock} />
                </div>
                <div>
                  <Label htmlFor={`p-cat-${p.id}`}>Category</Label>
                  <select
                    id={`p-cat-${p.id}`}
                    name="category_id"
                    defaultValue={p.category_id ?? ""}
                    className="min-h-11 w-full rounded-xl border border-brand-espresso/10 bg-white px-4 text-sm shadow-sm focus:border-brand-clay focus:outline-none focus:ring-2 focus:ring-brand-clay/25"
                  >
                    <option value="">— None —</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor={`p-short-${p.id}`}>Short description (card)</Label>
                  <Input id={`p-short-${p.id}`} name="short_description" defaultValue={p.short_description ?? ""} />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor={`p-full-${p.id}`}>Full description</Label>
                  <Textarea id={`p-full-${p.id}`} name="full_description" rows={5} defaultValue={p.full_description ?? ""} />
                </div>
                <div>
                  <Label htmlFor={`p-mat-${p.id}`}>Material</Label>
                  <Input id={`p-mat-${p.id}`} name="material" defaultValue={p.material ?? ""} />
                </div>
                <div>
                  <Label htmlFor={`p-dim-${p.id}`}>Dimensions</Label>
                  <Input id={`p-dim-${p.id}`} name="dimensions" defaultValue={p.dimensions ?? ""} />
                </div>
                <div>
                  <Label htmlFor={`p-wt-${p.id}`}>Weight</Label>
                  <Input id={`p-wt-${p.id}`} name="weight" defaultValue={p.weight ?? ""} />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor={`p-tags-${p.id}`}>Tags</Label>
                  <Input id={`p-tags-${p.id}`} name="tags" defaultValue={tagsStr} placeholder="comma-separated" />
                </div>
                <AdminProductImageField
                  inputId={`p-img-${p.id}`}
                  defaultValue={primary?.url ?? ""}
                  placeholder="Leave empty to keep current, or upload"
                />
                <div className="sm:col-span-2">
                  <Label htmlFor={`p-alt-${p.id}`}>Image alt</Label>
                  <Input id={`p-alt-${p.id}`} name="image_alt" defaultValue={primary?.alt ?? ""} />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor={`p-care-${p.id}`}>Care instructions</Label>
                  <Textarea id={`p-care-${p.id}`} name="care_instructions" rows={2} defaultValue={p.care_instructions ?? ""} />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor={`p-ship-${p.id}`}>Shipping info</Label>
                  <Textarea id={`p-ship-${p.id}`} name="shipping_info" rows={2} defaultValue={p.shipping_info ?? ""} />
                </div>
                <div className="flex flex-wrap gap-4 sm:col-span-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="featured" className="h-4 w-4 rounded" defaultChecked={p.featured} />
                    <span className="text-sm text-brand-espresso/80">Featured</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="best_seller" className="h-4 w-4 rounded" defaultChecked={p.best_seller} />
                    <span className="text-sm text-brand-espresso/80">Best seller</span>
                  </label>
                </div>
              </div>
              {updateState?.error && <p className="text-sm text-brand-terracotta">{updateState.error}</p>}
              {updateState?.ok && <p className="text-sm text-brand-sage">Saved.</p>}
              <SaveButton />
            </form>
          </td>
        </tr>
      )}
    </>
  );
}
