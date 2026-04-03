import { NextResponse } from "next/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limited = rateLimit(`contact:${ip}`, 8, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }

  try {
    const ct = req.headers.get("content-type") ?? "";
    let body: z.infer<typeof schema>;
    if (ct.includes("application/json")) {
      body = schema.parse(await req.json());
    } else {
      const fd = await req.formData();
      body = schema.parse({
        name: fd.get("name"),
        email: fd.get("email"),
        message: fd.get("message"),
      });
    }
    /* Hook: forward to CRM, email provider, or Supabase `contact_messages` table when added */
    console.info("[contact]", body);
  } catch {
    return NextResponse.json({ error: "Invalid form" }, { status: 400 });
  }
  const origin = new URL(req.url).origin;
  return NextResponse.redirect(new URL("/contact?sent=1", origin));
}
