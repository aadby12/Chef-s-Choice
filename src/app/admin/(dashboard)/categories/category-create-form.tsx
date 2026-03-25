"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createCategory, type CategoryActionState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: CategoryActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" disabled={pending}>
      {pending ? "Saving…" : "Add category"}
    </Button>
  );
}

export function CategoryCreateForm() {
  const [state, formAction] = useFormState(createCategory, initial);

  return (
    <form action={formAction} className="mb-10 space-y-4 rounded-2xl border border-brand-espresso/10 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-espresso/45">New collection</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="cat-name">Name</Label>
          <Input id="cat-name" name="name" required placeholder="e.g. Stainless Steel Cookware" />
        </div>
        <div>
          <Label htmlFor="cat-slug">Slug (optional)</Label>
          <Input id="cat-slug" name="slug" placeholder="auto from name if empty" />
        </div>
        <div>
          <Label htmlFor="cat-sort">Sort order</Label>
          <Input id="cat-sort" name="sort_order" type="number" min={0} defaultValue={0} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="cat-desc">Description</Label>
          <Input id="cat-desc" name="description" placeholder="Short line for collection cards" />
        </div>
        <div className="flex items-center gap-2 sm:col-span-2">
          <input type="checkbox" id="cat-future" name="is_future_collection" className="h-4 w-4 rounded" />
          <Label htmlFor="cat-future" className="mb-0 font-normal normal-case">
            Mark as future collection (coming soon)
          </Label>
        </div>
      </div>
      {state?.error && <p className="text-sm text-brand-terracotta">{state.error}</p>}
      {state?.ok && <p className="text-sm text-brand-sage">Category created.</p>}
      <SubmitButton />
    </form>
  );
}
