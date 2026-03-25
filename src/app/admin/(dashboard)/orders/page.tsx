import { createSupabaseServerClient } from "@/lib/supabase/server";
import { OrderRow } from "./order-row";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("orders")
    .select("id, email, phone, status, total_ghs, notes, created_at")
    .order("created_at", { ascending: false })
    .limit(80);

  const list = data ?? [];

  return (
    <div>
      <h1 className="font-display text-3xl text-brand-espresso">Orders</h1>
      <p className="mt-2 text-sm text-brand-espresso/65">
        Update fulfillment status and notes. Deleting an order removes its line items and payment rows (cascade).
      </p>
      <div className="mt-8 overflow-x-auto rounded-2xl border border-brand-espresso/10 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-brand-espresso/10 bg-brand-cream/60 text-xs uppercase tracking-wide text-brand-espresso/55">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-brand-espresso/60">
                  No orders yet — they appear here after checkout.
                </td>
              </tr>
            ) : (
              list.map((o) => <OrderRow key={o.id} o={o} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
