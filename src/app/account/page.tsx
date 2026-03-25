import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AccountDashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login?next=/account");
  }

  const { data: profile } = await supabase.from("profiles").select("full_name, email").eq("id", user.id).maybeSingle();

  return (
    <div>
      <h1 className="font-display text-3xl text-brand-espresso">Welcome back</h1>
      <p className="mt-2 text-sm text-brand-espresso/65">
        {profile?.full_name || profile?.email || user.email}
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link
          href="/account/orders"
          className="rounded-2xl border border-brand-espresso/10 bg-white p-6 text-sm font-medium shadow-sm hover:border-brand-clay/40"
        >
          View order history →
        </Link>
        <Link
          href="/account/addresses"
          className="rounded-2xl border border-brand-espresso/10 bg-white p-6 text-sm font-medium shadow-sm hover:border-brand-clay/40"
        >
          Saved addresses →
        </Link>
      </div>
    </div>
  );
}
