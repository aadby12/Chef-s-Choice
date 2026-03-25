import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { FAQ, HomepageSection, Testimonial } from "@/types/domain";

export async function getFaqs(): Promise<FAQ[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("faqs")
    .select("id, category, question, answer, sort_order")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  return (data as FAQ[]) ?? [];
}

export async function getTestimonials(featured?: boolean): Promise<Testimonial[]> {
  const supabase = await createSupabaseServerClient();
  let q = supabase
    .from("testimonials")
    .select("id, quote, author, subtitle, image_url, rating")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (featured) q = q.eq("featured", true);
  const { data } = await q;
  return (data as Testimonial[]) ?? [];
}

export async function getHomepageSections(): Promise<HomepageSection[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("homepage_sections")
    .select("section_key, title, subtitle, body")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  return (data as HomepageSection[]) ?? [];
}

export async function getDeliveryZones() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("delivery_zones")
    .select("id, name, slug, fee_ghs, free_over_ghs, eta_hours_min, eta_hours_max")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
}
