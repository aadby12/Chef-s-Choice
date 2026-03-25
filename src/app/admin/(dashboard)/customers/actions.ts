"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/admin/assert-admin";

export type CustomerActionState = { ok?: boolean; error?: string };

function parseUserId(raw: string): string | null {
  const s = raw.trim();
  if (!s) return null;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s)) {
    return null;
  }
  return s;
}

export async function createCustomer(_prev: CustomerActionState, formData: FormData): Promise<CustomerActionState> {
  const ctx = await assertAdmin();
  if (ctx.error === "not_signed_in") return { error: "Sign in again." };
  if (ctx.error === "not_admin") return { error: "Admin only." };

  const email = String(formData.get("email") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const marketingOptIn = formData.get("marketing_opt_in") === "on";
  const userId = parseUserId(String(formData.get("user_id") ?? ""));

  if (!email && !phone) return { error: "Enter at least an email or phone." };

  const { error } = await ctx.supabase.from("customers").insert({
    email,
    phone,
    notes,
    marketing_opt_in: marketingOptIn,
    user_id: userId,
  });

  if (error) {
    if (error.code === "23505") return { error: "That profile is already linked to a customer row." };
    return { error: error.message };
  }

  revalidatePath("/admin/customers");
  return { ok: true };
}

export async function updateCustomer(_prev: CustomerActionState, formData: FormData): Promise<CustomerActionState> {
  const ctx = await assertAdmin();
  if (ctx.error === "not_signed_in") return { error: "Sign in again." };
  if (ctx.error === "not_admin") return { error: "Admin only." };

  const id = String(formData.get("id") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const marketingOptIn = formData.get("marketing_opt_in") === "on";
  const userId = parseUserId(String(formData.get("user_id") ?? ""));

  if (!id) return { error: "Missing customer." };
  if (!email && !phone) return { error: "Enter at least an email or phone." };

  const { error } = await ctx.supabase
    .from("customers")
    .update({
      email,
      phone,
      notes,
      marketing_opt_in: marketingOptIn,
      user_id: userId,
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") return { error: "That profile is already linked to another customer." };
    return { error: error.message };
  }

  revalidatePath("/admin/customers");
  return { ok: true };
}

export async function deleteCustomer(_prev: CustomerActionState, formData: FormData): Promise<CustomerActionState> {
  const ctx = await assertAdmin();
  if (ctx.error === "not_signed_in") return { error: "Sign in again." };
  if (ctx.error === "not_admin") return { error: "Admin only." };

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "Missing customer." };

  const { error } = await ctx.supabase.from("customers").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/customers");
  return { ok: true };
}
