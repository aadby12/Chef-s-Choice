import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const bodySchema = z.object({
  email: z.string().email(),
  source: z.string().optional(),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limited = rateLimit(`newsletter:${ip}`, 20, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }

  let email: string;
  let source: string | undefined;
  const ct = req.headers.get("content-type") ?? "";
  try {
    if (ct.includes("application/json")) {
      const json = await req.json();
      const parsed = bodySchema.parse(json);
      email = parsed.email;
      source = parsed.source;
    } else {
      const form = await req.formData();
      email = String(form.get("email") ?? "");
      source = form.get("source") ? String(form.get("source")) : undefined;
      bodySchema.parse({ email, source });
    }
  } catch {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  try {
    const admin = createSupabaseAdminClient();
    const { error } = await admin.from("newsletter_subscribers").upsert(
      { email, source: source ?? "footer" },
      { onConflict: "email" }
    );
    if (error) throw error;
  } catch {
    return NextResponse.json({ error: "Could not save subscription" }, { status: 500 });
  }

  if (ct.includes("application/json")) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.redirect(new URL("/?subscribed=1", req.url));
}
