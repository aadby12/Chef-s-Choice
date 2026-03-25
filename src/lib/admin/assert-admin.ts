import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function assertAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { supabase: null as null, error: "not_signed_in" as const };
  }
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") {
    return { supabase: null as null, error: "not_admin" as const };
  }
  return { supabase, user, error: null as null };
}
