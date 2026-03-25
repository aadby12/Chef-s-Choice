/**
 * One-time: create or update an Auth user and grant admin (profiles.role + admin_users).
 *
 * Usage (local only — remove ADMIN_BOOTSTRAP_PASSWORD from .env.local after success):
 *   npm run bootstrap:admin
 *
 * PowerShell one-off vars (not bash): `$env:ADMIN_BOOTSTRAP_EMAIL='a@b.com'; $env:ADMIN_BOOTSTRAP_PASSWORD='...'; npm run bootstrap:admin`
 */
import { createClient } from "@supabase/supabase-js";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { loadProjectEnv } from "./load-env";

const projectRoot = loadProjectEnv();

if (!existsSync(join(projectRoot, ".env.local"))) {
  console.error("No .env.local at:", join(projectRoot, ".env.local"));
  console.error("cwd:", process.cwd(), "| projectRoot:", projectRoot);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_BOOTSTRAP_PASSWORD?.trim();

async function main() {
  if (!url || !serviceKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }
  if (!email || !password) {
    console.error(
      "Set ADMIN_BOOTSTRAP_EMAIL and ADMIN_BOOTSTRAP_PASSWORD (e.g. in .env.local), then run again.\nRemove the password from env after this succeeds."
    );
    process.exit(1);
  }

  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

  let userId: string;

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: "Store Admin" },
  });

  if (createErr) {
    const msg = createErr.message?.toLowerCase() ?? "";
    const exists =
      msg.includes("already been registered") ||
      msg.includes("already exists") ||
      createErr.status === 422;
    if (!exists) {
      console.error("createUser:", createErr.message);
      process.exit(1);
    }
    const { data: listData, error: listErr } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    if (listErr) {
      console.error("listUsers:", listErr.message);
      process.exit(1);
    }
    const existing = listData.users.find((u) => u.email?.toLowerCase() === email);
    if (!existing) {
      console.error("User exists but could not be found in listUsers.");
      process.exit(1);
    }
    userId = existing.id;
    const { error: updErr } = await admin.auth.admin.updateUserById(userId, {
      password,
      email_confirm: true,
    });
    if (updErr) {
      console.error("updateUserById:", updErr.message);
      process.exit(1);
    }
    console.info("Updated password and confirmed email for existing user.");
  } else if (created.user) {
    userId = created.user.id;
    console.info("Created new Auth user.");
  } else {
    console.error("Unexpected createUser response");
    process.exit(1);
  }

  /* Ensure profile row exists (trigger usually creates it; upsert covers edge cases). */
  const { error: roleErr } = await admin.from("profiles").upsert(
    { id: userId, email, full_name: "Store Admin", role: "admin" },
    { onConflict: "id" }
  );
  if (roleErr) {
    console.error("profiles upsert:", roleErr.message);
    process.exit(1);
  }

  const { error: admErr } = await admin.from("admin_users").upsert({ user_id: userId }, { onConflict: "user_id" });
  if (admErr) {
    console.error("admin_users upsert:", admErr.message);
    process.exit(1);
  }

  console.info("Admin ready:", email);
  console.info("Sign in at /admin/login — then remove ADMIN_BOOTSTRAP_PASSWORD from your env file.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
