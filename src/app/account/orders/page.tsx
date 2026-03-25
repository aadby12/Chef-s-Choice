import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatGhs } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/account/orders");

  const { data: orders } = await supabase
    .from("orders")
    .select("id, status, total_ghs, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-3xl text-brand-espresso">Orders</h1>
      <p className="mt-2 text-sm text-brand-espresso/65">Statuses update as payments and dispatch progress.</p>
      <ul className="mt-8 space-y-3">
        {(orders ?? []).map((o) => (
          <li key={o.id} className="flex flex-col gap-1 rounded-2xl border border-brand-espresso/10 bg-white p-4 text-sm shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-xs text-brand-espresso/45">{o.id}</p>
              <p className="font-medium capitalize text-brand-espresso">{o.status}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{formatGhs(Number(o.total_ghs))}</p>
              <p className="text-xs text-brand-espresso/50">{new Date(o.created_at).toLocaleString()}</p>
            </div>
          </li>
        ))}
      </ul>
      {(orders ?? []).length === 0 && <p className="mt-8 text-sm text-brand-espresso/60">No orders yet — your kitchen upgrade awaits.</p>}
    </div>
  );
}
