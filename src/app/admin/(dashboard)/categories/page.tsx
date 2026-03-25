import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CategoryCreateForm } from "./category-create-form";
import { CategoryRow } from "./category-row";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("categories").select("*").order("sort_order", { ascending: true });

  const list = data ?? [];

  return (
    <div>
      <h1 className="font-display text-3xl text-brand-espresso">Categories</h1>
      <p className="mt-2 text-sm text-brand-espresso/65">
        Collections power shop filters and{" "}
        <Link href="/categories" className="font-medium text-brand-terracotta hover:underline">
          the storefront grid
        </Link>
        . Or run{" "}
        <code className="rounded bg-brand-mist px-1.5 py-0.5 text-xs">npm run db:seed</code> for demo data.
      </p>

      <CategoryCreateForm />

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand-espresso/20 bg-brand-mist/30 px-6 py-10 text-center text-sm text-brand-espresso/70">
          <p>No categories yet.</p>
          <p className="mt-2">
            Add one above, or in the project terminal run{" "}
            <code className="rounded bg-white px-2 py-1 text-brand-espresso">npm run db:seed</code>
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {list.map((c) => (
            <CategoryRow key={c.id} c={c} />
          ))}
        </div>
      )}
    </div>
  );
}
