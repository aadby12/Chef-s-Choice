import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-3xl text-brand-espresso">Coupons</h1>
      <div className="mt-8 space-y-2">
        {(data ?? []).map((c) => (
          <div key={c.id} className="rounded-xl border border-brand-espresso/10 bg-white p-4 text-sm shadow-sm">
            <p className="font-mono font-semibold">{c.code}</p>
            <p className="text-xs text-brand-espresso/60">{c.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
