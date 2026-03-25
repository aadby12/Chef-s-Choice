import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CustomerCreateForm } from "./customer-create-form";
import { CustomerRow } from "./customer-row";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("customers").select("*").order("created_at", { ascending: false }).limit(100);

  const list = data ?? [];

  return (
    <div>
      <h1 className="font-display text-3xl text-brand-espresso">Customers</h1>
      <p className="mt-2 text-sm text-brand-espresso/65">
        CRM records (often synced from signup). Edit contact details, notes, and marketing consent.
      </p>

      <CustomerCreateForm />

      <div className="mt-2 grid gap-2">
        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand-espresso/20 bg-brand-mist/30 px-6 py-10 text-center text-sm text-brand-espresso/70">
            No customer rows yet — they are created when users sign up, or add one above.
          </div>
        ) : (
          list.map((c) => <CustomerRow key={c.id} c={c} />)
        )}
      </div>
    </div>
  );
}
