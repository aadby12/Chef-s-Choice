import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AddressesPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/account/addresses");

  const { data: rows } = await supabase
    .from("addresses")
    .select("id, label, line1, line2, city, is_default")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-3xl text-brand-espresso">Addresses</h1>
      <p className="mt-2 text-sm text-brand-espresso/65">Saved for faster checkout — manage via Supabase or forthcoming inline editor.</p>
      <ul className="mt-8 space-y-3">
        {(rows ?? []).map((a) => (
          <li key={a.id} className="rounded-2xl border border-brand-espresso/10 bg-white p-4 text-sm shadow-sm">
            {a.label && <p className="text-xs font-semibold uppercase tracking-wide text-brand-espresso/45">{a.label}</p>}
            <p className="mt-1 text-brand-espresso">
              {a.line1}
              {a.line2 ? `, ${a.line2}` : ""}
            </p>
            <p className="text-brand-espresso/70">{a.city}</p>
            {a.is_default && <p className="mt-2 text-xs font-medium text-brand-sage">Default</p>}
          </li>
        ))}
      </ul>
      {(rows ?? []).length === 0 && (
        <p className="mt-8 text-sm text-brand-espresso/60">No saved addresses — add one during your next checkout (CRUD in Admin).</p>
      )}
    </div>
  );
}
