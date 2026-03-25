"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createCustomer, type CustomerActionState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initial: CustomerActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" disabled={pending}>
      {pending ? "Adding…" : "Add customer"}
    </Button>
  );
}

export function CustomerCreateForm() {
  const [state, formAction] = useFormState(createCustomer, initial);

  return (
    <form action={formAction} className="mb-10 space-y-4 rounded-2xl border border-brand-espresso/10 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-espresso/45">New CRM entry</p>
      <p className="text-sm text-brand-espresso/60">For walk-ins or leads without a storefront account. Optional: link a Supabase profile UUID.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="cu-new-email">Email</Label>
          <Input id="cu-new-email" name="email" type="email" placeholder="name@example.com" />
        </div>
        <div>
          <Label htmlFor="cu-new-phone">Phone</Label>
          <Input id="cu-new-phone" name="phone" placeholder="+233 …" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="cu-new-uid">Profile user ID (optional)</Label>
          <Input id="cu-new-uid" name="user_id" placeholder="uuid from auth.users / profiles" className="font-mono text-xs" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="cu-new-notes">Notes</Label>
          <Textarea id="cu-new-notes" name="notes" rows={3} placeholder="Preferences, VIP, last order summary…" />
        </div>
        <div className="flex items-center gap-2 sm:col-span-2">
          <input type="checkbox" id="cu-new-mkt" name="marketing_opt_in" className="h-4 w-4 rounded" />
          <Label htmlFor="cu-new-mkt" className="mb-0 font-normal normal-case">
            Marketing opt-in
          </Label>
        </div>
      </div>
      {state?.error && <p className="text-sm text-brand-terracotta">{state.error}</p>}
      {state?.ok && <p className="text-sm text-brand-sage">Customer added.</p>}
      <SubmitButton />
    </form>
  );
}
