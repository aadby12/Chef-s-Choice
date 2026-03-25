import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Review } from "@/types/domain";

export async function getReviewsForProduct(productId: string): Promise<Review[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("reviews")
    .select("id, product_id, author_name, rating, title, body, created_at")
    .eq("product_id", productId)
    .eq("approved", true)
    .order("created_at", { ascending: false });
  return (data as Review[]) ?? [];
}
