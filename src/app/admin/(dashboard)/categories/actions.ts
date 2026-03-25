"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/admin/assert-admin";
import { slugify } from "@/lib/utils";

export type CategoryActionState = { ok?: boolean; error?: string };

export async function createCategory(_prev: CategoryActionState, formData: FormData): Promise<CategoryActionState> {
  const ctx = await assertAdmin();
  if (ctx.error === "not_signed_in") return { error: "Sign in again." };
  if (ctx.error === "not_admin") return { error: "Admin only." };

  const name = String(formData.get("name") ?? "").trim();
  let slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const description = String(formData.get("description") ?? "").trim() || null;
  const sortOrder = Math.max(0, parseInt(String(formData.get("sort_order") ?? "0"), 10) || 0);
  const isFuture = formData.get("is_future_collection") === "on";

  if (!name) return { error: "Name is required." };
  if (!slug) slug = slugify(name);
  if (!slug) return { error: "Could not derive slug — enter one manually (lowercase, hyphens)." };

  const { error } = await ctx.supabase.from("categories").insert({
    name,
    slug,
    description,
    sort_order: sortOrder,
    is_future_collection: isFuture,
  });

  if (error) {
    if (error.code === "23505") return { error: "That slug already exists — choose another." };
    return { error: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  revalidatePath("/shop");
  return { ok: true };
}

export async function updateCategory(_prev: CategoryActionState, formData: FormData): Promise<CategoryActionState> {
  const ctx = await assertAdmin();
  if (ctx.error === "not_signed_in") return { error: "Sign in again." };
  if (ctx.error === "not_admin") return { error: "Admin only." };

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  let slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const description = String(formData.get("description") ?? "").trim() || null;
  const sortOrder = Math.max(0, parseInt(String(formData.get("sort_order") ?? "0"), 10) || 0);
  const isFuture = formData.get("is_future_collection") === "on";

  if (!id) return { error: "Missing category." };
  if (!name) return { error: "Name is required." };
  if (!slug) slug = slugify(name);
  if (!slug) return { error: "Could not derive slug — enter one manually." };

  const { error } = await ctx.supabase
    .from("categories")
    .update({
      name,
      slug,
      description,
      sort_order: sortOrder,
      is_future_collection: isFuture,
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") return { error: "That slug already exists — choose another." };
    return { error: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  revalidatePath("/shop");
  return { ok: true };
}

export async function deleteCategory(_prev: CategoryActionState, formData: FormData): Promise<CategoryActionState> {
  const ctx = await assertAdmin();
  if (ctx.error === "not_signed_in") return { error: "Sign in again." };
  if (ctx.error === "not_admin") return { error: "Admin only." };

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "Missing category." };

  const { error } = await ctx.supabase.from("categories").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  revalidatePath("/shop");
  return { ok: true };
}
