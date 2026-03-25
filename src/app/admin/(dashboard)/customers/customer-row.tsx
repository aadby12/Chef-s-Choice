"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import { deleteCustomer, updateCustomer, type CustomerActionState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type CustomerRow = {
  id: string;
  user_id: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
  marketing_opt_in: boolean;
};

const initial: CustomerActionState = {};

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" size="sm" disabled={pending}>
      {pending ? "Saving…" : "Save"}
    </Button>
  );
}

export function CustomerRow({ c }: { c: CustomerRow }) {
  const [open, setOpen] = useState(false);
  const [updateState, updateAction] = useFormState(updateCustomer, initial);
  const [deleteState, deleteAction] = useFormState(deleteCustomer, initial);

  return (
    <div className="rounded-xl border border-brand-espresso/10 bg-white p-4 text-sm shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium text-brand-espresso">{c.email ?? "—"}</p>
          <p className="text-xs text-brand-espresso/50">{c.phone ?? "—"}</p>
          {c.user_id && <p className="mt-1 font-mono text-[10px] text-brand-espresso/40">profile: {c.user_id.slice(0, 8)}…</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-brand-espresso/45">{c.marketing_opt_in ? "Marketing ✓" : "No marketing"}</span>
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
                if (!confirm(`Remove CRM row for ${c.email ?? c.phone ?? c.id}?`)) {
                  e.preventDefault();
                }
              }}
            >
              Delete
            </Button>
          </form>
        </div>
      </div>
      {c.notes && !open && <p className="mt-2 text-brand-espresso/70">{c.notes}</p>}
      {deleteState?.error && <p className="mt-2 text-xs text-brand-terracotta">{deleteState.error}</p>}

      {open && (
        <form action={updateAction} className="mt-4 space-y-3 border-t border-brand-espresso/10 pt-4">
          <input type="hidden" name="id" value={c.id} />
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor={`cu-em-${c.id}`}>Email</Label>
              <Input id={`cu-em-${c.id}`} name="email" type="email" defaultValue={c.email ?? ""} />
            </div>
            <div>
              <Label htmlFor={`cu-ph-${c.id}`}>Phone</Label>
              <Input id={`cu-ph-${c.id}`} name="phone" defaultValue={c.phone ?? ""} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor={`cu-uid-${c.id}`}>Profile user ID</Label>
              <Input id={`cu-uid-${c.id}`} name="user_id" defaultValue={c.user_id ?? ""} className="font-mono text-xs" placeholder="empty = not linked" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor={`cu-notes-${c.id}`}>Notes</Label>
              <Textarea id={`cu-notes-${c.id}`} name="notes" rows={3} defaultValue={c.notes ?? ""} />
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <input
                type="checkbox"
                id={`cu-mkt-${c.id}`}
                name="marketing_opt_in"
                className="h-4 w-4 rounded"
                defaultChecked={c.marketing_opt_in}
              />
              <Label htmlFor={`cu-mkt-${c.id}`} className="mb-0 font-normal normal-case">
                Marketing opt-in
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
