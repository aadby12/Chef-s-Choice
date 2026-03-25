import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Category, Product } from "@/types/domain";

type ShopFilters = {
  q?: string;
  category?: string;
  material?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  bestSeller?: boolean;
  sort?: "newest" | "price_asc" | "price_desc" | "popular";
  page?: number;
  pageSize?: number;
};

function mapProduct(row: Record<string, unknown>): Product {
  const c = row.categories as { name: string; slug: string } | { name: string; slug: string }[] | null;
  const cats = Array.isArray(c) ? c : c ? [c] : [];
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    short_description: (row.short_description as string) ?? null,
    full_description: (row.full_description as string) ?? null,
    price: Number(row.price),
    compare_at_price: row.compare_at_price != null ? Number(row.compare_at_price) : null,
    sku: row.sku as string,
    stock: Number(row.stock),
    category_id: (row.category_id as string) ?? null,
    material: (row.material as string) ?? null,
    dimensions: (row.dimensions as string) ?? null,
    weight: (row.weight as string) ?? null,
    featured: Boolean(row.featured),
    best_seller: Boolean(row.best_seller),
    care_instructions: (row.care_instructions as string) ?? null,
    shipping_info: (row.shipping_info as string) ?? null,
    tags: (row.tags as string[]) ?? [],
    rating: row.rating != null ? Number(row.rating) : null,
    review_count: Number(row.review_count ?? 0),
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    categories: cats[0] ?? null,
    product_images: (row.product_images as Product["product_images"]) ?? [],
  };
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return data as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("categories").select("*").eq("slug", slug).maybeSingle();
  return (data as Category) ?? null;
}

export async function getProducts(filters: ShopFilters = {}): Promise<{
  products: Product[];
  total: number;
}> {
  const supabase = await createSupabaseServerClient();
  const pageSize = Math.min(filters.pageSize ?? 12, 48);
  const page = Math.max(filters.page ?? 1, 1);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("products")
    .select(
      `
      *,
      categories ( name, slug ),
      product_images ( id, url, alt, sort_order, product_id )
    `,
      { count: "exact" }
    );

  if (filters.q?.trim()) {
    const raw = filters.q.trim().replace(/%/g, "");
    const q = `%${raw}%`;
    query = query.or(`name.ilike.${q},short_description.ilike.${q},sku.ilike.${q}`);
  }
  if (filters.category) {
    const cat = await getCategoryBySlug(filters.category);
    if (!cat) return { products: [], total: 0 };
    query = query.eq("category_id", cat.id);
  }
  if (filters.material) {
    query = query.eq("material", filters.material);
  }
  if (filters.minPrice != null) {
    query = query.gte("price", filters.minPrice);
  }
  if (filters.maxPrice != null) {
    query = query.lte("price", filters.maxPrice);
  }
  if (filters.inStock) {
    query = query.gt("stock", 0);
  }
  if (filters.featured) {
    query = query.eq("featured", true);
  }
  if (filters.bestSeller) {
    query = query.eq("best_seller", true);
  }

  switch (filters.sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "popular":
      query = query.order("review_count", { ascending: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
  }

  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error || !data) {
    return { products: [], total: 0 };
  }

  const products = data.map((row) =>
    mapProduct({
      ...row,
      product_images: (row.product_images as { sort_order: number }[])?.sort(
        (a, b) => a.sort_order - b.sort_order
      ),
    })
  );
  return { products, total: count ?? 0 };
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      categories ( name, slug ),
      product_images ( id, url, alt, sort_order, product_id )
    `
    )
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return mapProduct({
    ...data,
    product_images: ((data.product_images as { sort_order: number }[]) ?? []).sort(
      (a, b) => a.sort_order - b.sort_order
    ),
  });
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      categories ( name, slug ),
      product_images ( id, url, alt, sort_order, product_id )
    `
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return mapProduct({
    ...data,
    product_images: ((data.product_images as { sort_order: number }[]) ?? []).sort(
      (a, b) => a.sort_order - b.sort_order
    ),
  });
}

export async function getRelatedProducts(categoryId: string | null, excludeId: string, limit = 4) {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("products")
    .select(
      `
      *,
      categories ( name, slug ),
      product_images ( id, url, alt, sort_order, product_id )
    `
    )
    .neq("id", excludeId)
    .limit(limit);

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data } = await query;
  return (data ?? []).map((row) =>
    mapProduct({
      ...row,
      product_images: ((row.product_images as { sort_order: number }[]) ?? []).sort(
        (a, b) => a.sort_order - b.sort_order
      ),
    })
  );
}
