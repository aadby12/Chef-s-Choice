import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();
  const [products, orders, customers] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("customers").select("id", { count: "exact", head: true }),
  ]);

  const kpis = [
    { label: "Products", value: products.count ?? 0 },
    { label: "Orders", value: orders.count ?? 0 },
    { label: "Customers", value: customers.count ?? 0 },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-brand-espresso">Dashboard</h1>
      <p className="mt-2 text-sm text-brand-espresso/65">Operational snapshot — powered by Supabase RLS & service role.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl border border-brand-espresso/10 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-espresso/45">{k.label}</p>
            <p className="mt-3 font-display text-3xl text-brand-espresso">{k.value}</p>
          </div>
        ))}
      </div>
      <p className="mt-10 text-sm text-brand-espresso/60">
        Deep edits (images, inventory, content blocks) can be extended with server actions + Supabase Storage uploads — schema
        and RLS are production-ready.
      </p>
    </div>
  );
}
