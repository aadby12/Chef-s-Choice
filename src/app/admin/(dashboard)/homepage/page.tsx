import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminHomepagePage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("homepage_sections").select("*").order("sort_order", { ascending: true });

  return (
    <div>
      <h1 className="font-display text-3xl text-brand-espresso">Homepage content</h1>
      <pre className="mt-8 overflow-x-auto rounded-2xl border border-brand-espresso/10 bg-white p-4 text-xs shadow-sm">
        {JSON.stringify(data ?? [], null, 2)}
      </pre>
    </div>
  );
}
