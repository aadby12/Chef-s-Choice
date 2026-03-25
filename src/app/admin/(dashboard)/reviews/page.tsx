import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ReviewRow } from "./review-row";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("reviews")
    .select("id, product_id, rating, title, body, author_name, approved, created_at, products(name, slug)")
    .order("created_at", { ascending: false })
    .limit(100);

  const list = data ?? [];

  return (
    <div>
      <h1 className="font-display text-3xl text-brand-espresso">Reviews</h1>
      <p className="mt-2 text-sm text-brand-espresso/65">Approve for storefront display, hide, or remove spam.</p>
      <div className="mt-8 space-y-3">
        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand-espresso/20 bg-brand-mist/30 px-6 py-10 text-center text-sm text-brand-espresso/70">
            No reviews yet.
          </div>
        ) : (
          list.map((r) => <ReviewRow key={r.id} r={r} />)
        )}
      </div>
    </div>
  );
}
