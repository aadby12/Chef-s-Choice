"use client";

import { useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthSplitShell } from "@/components/auth/auth-split-shell";

export function LoginClient({ heroSrc }: { heroSrc: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    window.location.href = "/account";
  }

  return (
    <AuthSplitShell
      title="Welcome back"
      subtitle="Sign in to track orders, save addresses, and move through checkout faster."
      heroSrc={heroSrc}
      heroAlt="Warm kitchen scene with cookware and prepared food"
    >
      <form onSubmit={onSubmit} className="max-w-md space-y-4 rounded-2xl border border-brand-espresso/10 bg-brand-cream/50 p-6 shadow-sm backdrop-blur-sm">
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
            autoComplete="current-password"
          />
        </div>
        {error && <p className="text-sm text-brand-terracotta">{error}</p>}
        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-brand-espresso/65">
        New here?{" "}
        <Link href="/auth/signup" className="font-semibold text-brand-terracotta underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </AuthSplitShell>
  );
}
