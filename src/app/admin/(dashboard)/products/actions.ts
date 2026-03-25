"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/admin/assert-admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

type ServerSupabase = Awaited<ReturnType<typeof createSupabaseServerClient>>;

export type ProductActionState = { ok?: boolean; error?: string };

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function parseOptionalNumber(raw: string | null): number | null {
  const s = String(raw ?? "").trim();
  if (!s) return null;
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

async function syncPrimaryImage(
  supabase: ServerSupabase,
  productId: string,
  imageUrl: string | null,
  imageAlt: string | null
) {
  const url = imageUrl?.trim();
  if (!url) return;
  const alt = imageAlt?.trim() || null;
  const { data: first } = await supabase
    .from("product_images")
    .select("id")
    .eq("product_id", productId)
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (first?.id) {
    await supabase.from("product_images").update({ url, alt }).eq("id", first.id);
  } else {
    await supabase.from("product_images").insert({ product_id: productId, url, alt, sort_order: 0 });
  }
}

function revalidateProductPaths(slug: string) {
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/categories");
  revalidatePath(`/products/${slug}`);
}

export async function createProduct(_prev: ProductActionState, formData: FormData): Promise<ProductActionState> {
  const ctx = await assertAdmin();
  if (ctx.error === "not_signed_in") return { error: "Sign in again." };
  if (ctx.error === "not_admin") return { error: "Admin only." };

  const name = String(formData.get("name") ?? "").trim();
  let slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  let sku = String(formData.get("sku") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const price = parseFloat(priceRaw);
  const compareAt = parseOptionalNumber(String(formData.get("compare_at_price") ?? ""));
  const stock = Math.max(0, parseInt(String(formData.get("stock") ?? "0"), 10) || 0);
  const categoryId = String(formData.get("category_id") ?? "").trim() || null;
  const shortDescription = String(formData.get("short_description") ?? "").trim() || null;
  const fullDescription = String(formData.get("full_description") ?? "").trim() || null;
  const material = String(formData.get("material") ?? "").trim() || null;
  const dimensions = String(formData.get("dimensions") ?? "").trim() || null;
  const weight = String(formData.get("weight") ?? "").trim() || null;
  const careInstructions = String(formData.get("care_instructions") ?? "").trim() || null;
  const shippingInfo = String(formData.get("shipping_info") ?? "").trim() || null;
  const tags = parseTags(String(formData.get("tags") ?? ""));
  const featured = formData.get("featured") === "on";
  const bestSeller = formData.get("best_seller") === "on";
  const imageUrl = String(formData.get("image_url") ?? "").trim() || null;
  const imageAlt = String(formData.get("image_alt") ?? "").trim() || null;

  if (!name) return { error: "Name is required." };
  if (!slug) slug = slugify(name);
  if (!slug) return { error: "Enter a valid slug (lowercase, hyphens)." };
  if (!sku) sku = `AUTO-${randomUUID().slice(0, 10).toUpperCase()}`;
  if (!Number.isFinite(price) || price < 0) return { error: "Enter a valid price (GHS)." };

  const { data: inserted, error } = await ctx.supabase
    .from("products")
    .insert({
      name,
      slug,
      sku,
      price,
      compare_at_price: compareAt,
      stock,
      category_id: categoryId,
      short_description: shortDescription,
      full_description: fullDescription,
      material,
      dimensions,
      weight,
      care_instructions: careInstructions,
      shipping_info: shippingInfo,
      tags: tags.length ? tags : [],
      featured,
      best_seller: bestSeller,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") return { error: "Slug or SKU already exists — change one of them." };
    return { error: error.message };
  }

  if (inserted?.id && imageUrl) {
    await syncPrimaryImage(ctx.supabase, inserted.id, imageUrl, imageAlt);
  }

  revalidateProductPaths(slug);
  return { ok: true };
}

export async function updateProduct(_prev: ProductActionState, formData: FormData): Promise<ProductActionState> {
  const ctx = await assertAdmin();
  if (ctx.error === "not_signed_in") return { error: "Sign in again." };
  if (ctx.error === "not_admin") return { error: "Admin only." };

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  let slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const sku = String(formData.get("sku") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const price = parseFloat(priceRaw);
  const compareAt = parseOptionalNumber(String(formData.get("compare_at_price") ?? ""));
  const stock = Math.max(0, parseInt(String(formData.get("stock") ?? "0"), 10) || 0);
  const categoryId = String(formData.get("category_id") ?? "").trim() || null;
  const shortDescription = String(formData.get("short_description") ?? "").trim() || null;
  const fullDescription = String(formData.get("full_description") ?? "").trim() || null;
  const material = String(formData.get("material") ?? "").trim() || null;
  const dimensions = String(formData.get("dimensions") ?? "").trim() || null;
  const weight = String(formData.get("weight") ?? "").trim() || null;
  const careInstructions = String(formData.get("care_instructions") ?? "").trim() || null;
  const shippingInfo = String(formData.get("shipping_info") ?? "").trim() || null;
  const tags = parseTags(String(formData.get("tags") ?? ""));
  const featured = formData.get("featured") === "on";
  const bestSeller = formData.get("best_seller") === "on";
  const imageUrl = String(formData.get("image_url") ?? "").trim() || null;
  const imageAlt = String(formData.get("image_alt") ?? "").trim() || null;

  if (!id) return { error: "Missing product." };
  if (!name) return { error: "Name is required." };
  if (!slug) slug = slugify(name);
  if (!slug) return { error: "Enter a valid slug." };
  if (!sku) return { error: "SKU is required." };
  if (!Number.isFinite(price) || price < 0) return { error: "Enter a valid price (GHS)." };

  const { data: before } = await ctx.supabase.from("products").select("slug").eq("id", id).maybeSingle();
  const oldSlug = before?.slug;

  const { error } = await ctx.supabase
    .from("products")
    .update({
      name,
      slug,
      sku,
      price,
      compare_at_price: compareAt,
      stock,
      category_id: categoryId,
      short_description: shortDescription,
      full_description: fullDescription,
      material,
      dimensions,
      weight,
      care_instructions: careInstructions,
      shipping_info: shippingInfo,
      tags: tags.length ? tags : [],
      featured,
      best_seller: bestSeller,
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") return { error: "Slug or SKU already exists." };
    return { error: error.message };
  }

  if (imageUrl) {
    await syncPrimaryImage(ctx.supabase, id, imageUrl, imageAlt);
  }

  revalidateProductPaths(slug);
  if (oldSlug && oldSlug !== slug) {
    revalidatePath(`/products/${oldSlug}`);
  }
  return { ok: true };
}

export async function deleteProduct(_prev: ProductActionState, formData: FormData): Promise<ProductActionState> {
  const ctx = await assertAdmin();
  if (ctx.error === "not_signed_in") return { error: "Sign in again." };
  if (ctx.error === "not_admin") return { error: "Admin only." };

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "Missing product." };

  const { data: row } = await ctx.supabase.from("products").select("slug").eq("id", id).maybeSingle();
  const { error } = await ctx.supabase.from("products").delete().eq("id", id);
  if (error) return { error: error.message };

  if (row?.slug) {
    revalidatePath(`/products/${row.slug}`);
  }
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/categories");
  return { ok: true };
}
