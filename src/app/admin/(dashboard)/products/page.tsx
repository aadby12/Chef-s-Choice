import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProductCreateForm } from "./product-create-form";
import { ProductRow } from "./product-row";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const supabase = await createSupabaseServerClient();

  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from("categories").select("id, name").order("sort_order", { ascending: true }),
    supabase
      .from("products")
      .select("*, product_images(url, alt, sort_order)")
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  const cats = categories ?? [];
  const list = products ?? [];

  return (
    <div>
      <h1 className="font-display text-3xl text-brand-espresso">Products</h1>
      <p className="mt-2 text-sm text-brand-espresso/65">
        Create and edit items shown on shop cards (image, short description, price, badges). Uploads to Supabase Storage can be
        wired later; for now paste a public image URL.
      </p>

      <ProductCreateForm categories={cats} />

      <div className="mt-4 overflow-x-auto rounded-2xl border border-brand-espresso/10 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-brand-espresso/10 bg-brand-cream/60 text-xs uppercase tracking-wide text-brand-espresso/55">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Flags</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-brand-espresso/60">
                  No products yet — add one above or run <code className="rounded bg-brand-mist px-2 py-0.5 text-xs">npm run db:seed</code>
                </td>
              </tr>
            ) : (
              list.map((p) => <ProductRow key={p.id} p={p} categories={cats} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
