import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("settings").select("*");

  return (
    <div>
      <h1 className="font-display text-3xl text-brand-espresso">Settings</h1>
      <p className="mt-2 text-sm text-brand-espresso/65">Key/value JSON for delivery messaging, banners, and feature flags.</p>
      <pre className="mt-8 overflow-x-auto rounded-2xl border border-brand-espresso/10 bg-white p-4 text-xs shadow-sm">
        {JSON.stringify(data ?? [], null, 2)}
      </pre>
    </div>
  );
}
