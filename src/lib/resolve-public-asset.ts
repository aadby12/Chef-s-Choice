import { existsSync } from "node:fs";
import { join } from "node:path";

/** Returns `preferred` if the file exists under `public/`, otherwise `fallback`. */
export function resolvePublicAsset(preferred: string, fallback: string): string {
  const rel = preferred.replace(/^\//, "");
  const abs = join(process.cwd(), "public", rel);
  return existsSync(abs) ? preferred : fallback;
}
