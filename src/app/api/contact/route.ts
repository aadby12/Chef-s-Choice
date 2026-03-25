import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function POST(req: Request) {
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
