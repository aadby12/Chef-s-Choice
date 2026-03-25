"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import {
  updateCategory,
  deleteCategory,
  type CategoryActionState,
} from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_future_collection: boolean;
};

const initial: CategoryActionState = {};

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" size="sm" disabled={pending}>
      {pending ? "Saving…" : "Save"}
    </Button>
  );
}

export function CategoryRow({ c }: { c: CategoryRow }) {
  const [open, setOpen] = useState(false);
  const [updateState, updateAction] = useFormState(updateCategory, initial);
  const [deleteState, deleteAction] = useFormState(deleteCategory, initial);

  return (
    <div className="rounded-xl border border-brand-espresso/10 bg-white p-4 text-sm shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-brand-espresso">{c.name}</p>
          <p className="text-xs text-brand-espresso/50">{c.slug}</p>
          {c.description && <p className="mt-2 text-brand-espresso/70">{c.description}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-right text-xs text-brand-espresso/45">
            {c.is_future_collection && <span className="font-semibold text-brand-clay">Future</span>}
            <span className="block">sort: {c.sort_order}</span>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => setOpen((v) => !v)}>
            {open ? "Close" : "Edit"}
          </Button>
          <form action={deleteAction} className="inline">
            <input type="hidden" name="id" value={c.id} />
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="border-brand-terracotta/40 text-brand-terracotta hover:bg-brand-terracotta/10"
              onClick={(e) => {
                if (!confirm(`Delete category “${c.name}”? Products in this category will have category cleared.`)) {
                  e.preventDefault();
                }
              }}
            >
              Delete
            </Button>
          </form>
        </div>
      </div>
      {deleteState?.error && <p className="mt-2 text-xs text-brand-terracotta">{deleteState.error}</p>}

      {open && (
        <form action={updateAction} className="mt-4 space-y-3 border-t border-brand-espresso/10 pt-4">
          <input type="hidden" name="id" value={c.id} />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor={`cat-name-${c.id}`}>Name</Label>
              <Input id={`cat-name-${c.id}`} name="name" required defaultValue={c.name} />
            </div>
            <div>
              <Label htmlFor={`cat-slug-${c.id}`}>Slug</Label>
              <Input id={`cat-slug-${c.id}`} name="slug" required defaultValue={c.slug} />
            </div>
            <div>
              <Label htmlFor={`cat-sort-${c.id}`}>Sort order</Label>
              <Input id={`cat-sort-${c.id}`} name="sort_order" type="number" min={0} defaultValue={c.sort_order} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor={`cat-desc-${c.id}`}>Description</Label>
              <Input id={`cat-desc-${c.id}`} name="description" defaultValue={c.description ?? ""} />
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <input
                type="checkbox"
                id={`cat-future-${c.id}`}
                name="is_future_collection"
                className="h-4 w-4 rounded"
                defaultChecked={c.is_future_collection}
              />
              <Label htmlFor={`cat-future-${c.id}`} className="mb-0 font-normal normal-case">
                Future collection
              </Label>
            </div>
          </div>
          {updateState?.error && <p className="text-sm text-brand-terracotta">{updateState.error}</p>}
          {updateState?.ok && <p className="text-sm text-brand-sage">Saved.</p>}
          <SaveButton />
        </form>
      )}
    </div>
  );
}
