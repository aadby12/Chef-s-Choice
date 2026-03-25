import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminFaqsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("faqs").select("*").order("sort_order", { ascending: true });

  return (
    <div>
      <h1 className="font-display text-3xl text-brand-espresso">FAQs</h1>
      <div className="mt-8 space-y-2">
        {(data ?? []).map((f) => (
          <div key={f.id} className="rounded-xl border border-brand-espresso/10 bg-white p-4 text-sm shadow-sm">
            <p className="font-medium">{f.question}</p>
            <p className="mt-1 text-brand-espresso/65">{f.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
