"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Container } from "@/components/layout/container";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err || !data.user) {
      setError(err?.message ?? "Login failed");
      return;
    }
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
    if (profile?.role !== "admin") {
      await supabase.auth.signOut();
      setError("Not an admin account");
      return;
    }
    window.location.href = "/admin";
  }

  return (
    <Container className="flex min-h-[60vh] max-w-md flex-col justify-center pb-14">
      <h1 className="font-display text-3xl text-brand-espresso">Admin sign in</h1>
      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-brand-espresso/10 bg-white p-6 shadow-sm">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p className="text-sm text-brand-terracotta">{error}</p>}
        <Button type="submit" className="w-full" variant="primary" disabled={loading}>
          {loading ? "Signing in…" : "Enter dashboard"}
        </Button>
      </form>
    </Container>
  );
}
