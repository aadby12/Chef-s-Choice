"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/admin/assert-admin";

export type OrderActionState = { ok?: boolean; error?: string };

const STATUSES = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
] as const;

function isOrderStatus(s: string): s is (typeof STATUSES)[number] {
  return (STATUSES as readonly string[]).includes(s);
}

export async function updateOrder(_prev: OrderActionState, formData: FormData): Promise<OrderActionState> {
  const ctx = await assertAdmin();
  if (ctx.error === "not_signed_in") return { error: "Sign in again." };
  if (ctx.error === "not_admin") return { error: "Admin only." };

  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!id) return { error: "Missing order." };
  if (!isOrderStatus(status)) return { error: "Invalid status." };

  const { error } = await ctx.supabase.from("orders").update({ status, notes }).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/orders");
  return { ok: true };
}

export async function deleteOrder(_prev: OrderActionState, formData: FormData): Promise<OrderActionState> {
  const ctx = await assertAdmin();
  if (ctx.error === "not_signed_in") return { error: "Sign in again." };
  if (ctx.error === "not_admin") return { error: "Admin only." };

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "Missing order." };

  const { error } = await ctx.supabase.from("orders").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/orders");
  return { ok: true };
}
