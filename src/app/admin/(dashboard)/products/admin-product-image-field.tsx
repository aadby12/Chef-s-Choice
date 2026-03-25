"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  inputId: string;
  name?: string;
  defaultValue?: string;
  placeholder?: string;
};

export function AdminProductImageField({ inputId, name = "image_url", defaultValue = "", placeholder }: Props) {
  const urlRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setHint(null);
    setBusy(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch("/api/admin/upload-product-image", {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const data = (await res.json()) as { error?: string; url?: string };
      if (!res.ok) throw new Error(data.error || "Upload failed");
      if (data.url && urlRef.current) {
        urlRef.current.value = data.url;
        setHint({ tone: "ok", text: "Uploaded — save the product to attach." });
      }
    } catch (err) {
      setHint({ tone: "err", text: err instanceof Error ? err.message : "Upload failed" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="sm:col-span-2 space-y-2">
      <Label htmlFor={inputId}>Primary image URL</Label>
      <Input
        ref={urlRef}
        id={inputId}
        name={name}
        type="url"
        defaultValue={defaultValue}
        placeholder={placeholder ?? "https://… or upload a file below"}
      />
      <div className="flex flex-wrap items-center gap-3">
        <label className="cursor-pointer text-sm font-medium text-brand-terracotta hover:underline">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={onPick}
            disabled={busy}
          />
          {busy ? "Uploading…" : "Upload file (Supabase Storage)"}
        </label>
        <span className="text-xs text-brand-espresso/50">JPEG / PNG / WebP / GIF · max 4MB</span>
      </div>
      {hint && (
        <p className={`text-xs ${hint.tone === "err" ? "text-brand-terracotta" : "text-brand-sage"}`}>{hint.text}</p>
      )}
    </div>
  );
}
