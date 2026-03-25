import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("testimonials").select("*").order("sort_order", { ascending: true });

  return (
    <div>
      <h1 className="font-display text-3xl text-brand-espresso">Testimonials</h1>
      <div className="mt-8 space-y-2">
        {(data ?? []).map((t) => (
          <div key={t.id} className="rounded-xl border border-brand-espresso/10 bg-white p-4 text-sm shadow-sm">
            <p className="text-brand-espresso/80">“{t.quote}”</p>
            <p className="mt-2 text-xs font-semibold text-brand-espresso/50">{t.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
