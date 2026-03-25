"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createProduct, type ProductActionState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminProductImageField } from "./admin-product-image-field";

const initial: ProductActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" disabled={pending}>
      {pending ? "Creating…" : "Add product"}
    </Button>
  );
}

export function ProductCreateForm({ categories }: { categories: { id: string; name: string }[] }) {
  const [state, formAction] = useFormState(createProduct, initial);

  return (
    <form action={formAction} className="mb-10 space-y-4 rounded-2xl border border-brand-espresso/10 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-espresso/45">New product</p>
      <p className="text-sm text-brand-espresso/60">
        Short description and primary image power the shop cards; full description appears on the product page.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="p-new-name">Name</Label>
          <Input id="p-new-name" name="name" required placeholder="e.g. Tri-ply Chef Pan 26cm" />
        </div>
        <div>
          <Label htmlFor="p-new-slug">Slug (optional)</Label>
          <Input id="p-new-slug" name="slug" placeholder="from name if empty" />
        </div>
        <div>
          <Label htmlFor="p-new-sku">SKU (optional)</Label>
          <Input id="p-new-sku" name="sku" placeholder="auto-generated if empty" />
        </div>
        <div>
          <Label htmlFor="p-new-price">Price (GHS)</Label>
          <Input id="p-new-price" name="price" type="number" inputMode="decimal" step="0.01" min={0} required />
        </div>
        <div>
          <Label htmlFor="p-new-compare">Compare-at price (optional)</Label>
          <Input id="p-new-compare" name="compare_at_price" type="number" inputMode="decimal" step="0.01" min={0} />
        </div>
        <div>
          <Label htmlFor="p-new-stock">Stock</Label>
          <Input id="p-new-stock" name="stock" type="number" min={0} defaultValue={0} />
        </div>
        <div>
          <Label htmlFor="p-new-cat">Category</Label>
          <select
            id="p-new-cat"
            name="category_id"
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
          <Label htmlFor="p-new-short">Short description (card)</Label>
          <Input id="p-new-short" name="short_description" placeholder="Line or two under the title on cards" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="p-new-full">Full description</Label>
          <Textarea id="p-new-full" name="full_description" rows={5} placeholder="Long copy for the product page" />
        </div>
        <div>
          <Label htmlFor="p-new-material">Material</Label>
          <Input id="p-new-material" name="material" placeholder="e.g. stainless_steel" />
        </div>
        <div>
          <Label htmlFor="p-new-dim">Dimensions</Label>
          <Input id="p-new-dim" name="dimensions" placeholder="Ø26cm" />
        </div>
        <div>
          <Label htmlFor="p-new-weight">Weight</Label>
          <Input id="p-new-weight" name="weight" placeholder="1.4kg" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="p-new-tags">Tags (comma-separated)</Label>
          <Input id="p-new-tags" name="tags" placeholder="chef pan, tri-ply" />
        </div>
        <AdminProductImageField inputId="p-new-img" />
        <div className="sm:col-span-2">
          <Label htmlFor="p-new-img-alt">Image alt text</Label>
          <Input id="p-new-img-alt" name="image_alt" placeholder="Describe the photo for accessibility" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="p-new-care">Care instructions</Label>
          <Textarea id="p-new-care" name="care_instructions" rows={2} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="p-new-ship">Shipping info</Label>
          <Textarea id="p-new-ship" name="shipping_info" rows={2} />
        </div>
        <div className="flex flex-wrap gap-4 sm:col-span-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="featured" className="h-4 w-4 rounded" />
            <span className="text-sm text-brand-espresso/80">Featured</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="best_seller" className="h-4 w-4 rounded" />
            <span className="text-sm text-brand-espresso/80">Best seller</span>
          </label>
        </div>
      </div>

      {state?.error && <p className="text-sm text-brand-terracotta">{state.error}</p>}
      {state?.ok && <p className="text-sm text-brand-sage">Product created.</p>}
      <SubmitButton />
    </form>
  );
}
