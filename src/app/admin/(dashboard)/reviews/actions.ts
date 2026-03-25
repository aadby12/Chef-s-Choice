"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/admin/assert-admin";

export type ReviewActionState = { ok?: boolean; error?: string };

export async function setReviewApproved(_prev: ReviewActionState, formData: FormData): Promise<ReviewActionState> {
  const ctx = await assertAdmin();
  if (ctx.error === "not_signed_in") return { error: "Sign in again." };
  if (ctx.error === "not_admin") return { error: "Admin only." };

  const id = String(formData.get("id") ?? "").trim();
  const approved = String(formData.get("approved") ?? "") === "true";

  if (!id) return { error: "Missing review." };

  const { error } = await ctx.supabase.from("reviews").update({ approved }).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/reviews");
  revalidatePath("/shop");
  return { ok: true };
}

export async function deleteReview(_prev: ReviewActionState, formData: FormData): Promise<ReviewActionState> {
  const ctx = await assertAdmin();
  if (ctx.error === "not_signed_in") return { error: "Sign in again." };
  if (ctx.error === "not_admin") return { error: "Admin only." };

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "Missing review." };

  const { error } = await ctx.supabase.from("reviews").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/reviews");
  revalidatePath("/shop");
  return { ok: true };
}
