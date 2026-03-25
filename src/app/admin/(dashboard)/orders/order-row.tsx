"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import { deleteOrder, updateOrder, type OrderActionState } from "./actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatGhs } from "@/lib/utils";

const STATUSES = ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"] as const;

type OrderRow = {
  id: string;
  email: string | null;
  phone: string | null;
  status: string;
  total_ghs: number | string;
  notes: string | null;
  created_at: string;
};

const initial: OrderActionState = {};

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" size="sm" disabled={pending}>
      {pending ? "Saving…" : "Save order"}
    </Button>
  );
}

export function OrderRow({ o }: { o: OrderRow }) {
  const [open, setOpen] = useState(false);
  const [updateState, updateAction] = useFormState(updateOrder, initial);
  const [deleteState, deleteAction] = useFormState(deleteOrder, initial);
  const total = Number(o.total_ghs);

  return (
    <>
      <tr className="border-b border-brand-espresso/5 align-top">
        <td className="px-4 py-3 font-mono text-xs">{o.id.slice(0, 8)}…</td>
        <td className="px-4 py-3">
          <div>{o.email}</div>
          <div className="text-xs text-brand-espresso/50">{o.phone}</div>
        </td>
        <td className="px-4 py-3 capitalize">{o.status}</td>
        <td className="px-4 py-3">{formatGhs(total)}</td>
        <td className="px-4 py-3">
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen((v) => !v)}>
              {open ? "Close" : "Edit"}
            </Button>
            <form action={deleteAction} className="inline">
              <input type="hidden" name="id" value={o.id} />
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="border-brand-terracotta/40 text-brand-terracotta hover:bg-brand-terracotta/10"
                onClick={(e) => {
                  if (!confirm(`Delete order ${o.id.slice(0, 8)}…? Line items and payments are removed.`)) {
                    e.preventDefault();
                  }
                }}
              >
                Delete
              </Button>
            </form>
          </div>
        </td>
      </tr>
      {deleteState?.error && (
        <tr className="border-b border-brand-espresso/5">
          <td colSpan={5} className="px-4 pb-2 text-xs text-brand-terracotta">
            {deleteState.error}
          </td>
        </tr>
      )}
      {open && (
        <tr className="border-b border-brand-espresso/10 bg-brand-mist/20">
          <td colSpan={5} className="px-4 py-6">
            <p className="mb-3 font-mono text-xs text-brand-espresso/50">Full id: {o.id}</p>
            <form action={updateAction} className="max-w-xl space-y-3">
              <input type="hidden" name="id" value={o.id} />
              <div>
                <Label htmlFor={`ord-st-${o.id}`}>Status</Label>
                <select
                  id={`ord-st-${o.id}`}
                  name="status"
                  defaultValue={o.status}
                  className="min-h-11 w-full rounded-xl border border-brand-espresso/10 bg-white px-4 text-sm shadow-sm focus:border-brand-clay focus:outline-none focus:ring-2 focus:ring-brand-clay/25"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor={`ord-notes-${o.id}`}>Internal notes</Label>
                <Textarea id={`ord-notes-${o.id}`} name="notes" rows={3} defaultValue={o.notes ?? ""} placeholder="Fulfillment notes, WhatsApp thread, etc." />
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
