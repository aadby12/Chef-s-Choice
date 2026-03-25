/**
 * Canonical site URL for metadata, Paystack callbacks, sitemap, etc.
 * `NEXT_PUBLIC_SITE_URL` must work with `new URL()`, so it needs a scheme.
 * Accepts `https://example.com`, `example.com`, or (local) `localhost:3000`.
 */
export function getSiteUrl(): string {
  let raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "";
  if (!raw) {
    return "http://localhost:3000";
  }
  raw = raw.replace(/\/+$/, "");
  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }
  if (raw.startsWith("localhost") || raw.startsWith("127.0.0.1")) {
    return `http://${raw}`;
  }
  return `https://${raw}`;
}
