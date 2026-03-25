import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Active zones for checkout (public read via RLS). */
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("delivery_zones")
      .select("id, name, slug, fee_ghs, free_over_ghs, eta_hours_min, eta_hours_max, sort_order")
      .eq("active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message, zones: [] }, { status: 500 });
    }

    return NextResponse.json({ zones: data ?? [] });
  } catch {
    return NextResponse.json({ zones: [] });
  }
}
