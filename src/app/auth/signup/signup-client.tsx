"use client";

import { useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";
import { AuthSplitShell } from "@/components/auth/auth-split-shell";

export function SignupClient({ heroSrc }: { heroSrc: string }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    window.location.href = "/account";
  }

  return (
    <AuthSplitShell
      title="Join the table"
      subtitle={`Create your ${BRAND.name} profile for faster checkout and order history.`}
      heroSrc={heroSrc}
      heroAlt="Signature enameled cookware on marble"
    >
      <form onSubmit={onSubmit} className="max-w-md space-y-4 rounded-2xl border border-brand-espresso/10 bg-brand-cream/50 p-6 shadow-sm backdrop-blur-sm">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} required autoComplete="name" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
        {error && <p className="text-sm text-brand-terracotta">{error}</p>}
        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? "Creating…" : "Create account"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-brand-espresso/65">
        Already registered?{" "}
        <Link href="/auth/login" className="font-semibold text-brand-terracotta underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthSplitShell>
  );
}
