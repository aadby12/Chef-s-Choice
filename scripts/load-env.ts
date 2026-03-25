/**
 * Load `.env` then `.env.local` (local wins). Same rules as bootstrap-admin.
 */
import { parse } from "dotenv";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export function mergeEnvFile(filePath: string, override: boolean) {
  if (!existsSync(filePath)) return;
  let raw = readFileSync(filePath, "utf8");
  if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
  const parsed = parse(raw);
  for (const [key, value] of Object.entries(parsed)) {
    if (override || process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

export function resolveProjectRoot(): string {
  const cwd = process.cwd();
  if (existsSync(join(cwd, ".env.local"))) return cwd;
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const fromScripts = resolve(scriptDir, "..");
  if (existsSync(join(fromScripts, ".env.local"))) return fromScripts;
  return fromScripts;
}

/** Merge project env files into `process.env`. Returns project root. */
export function loadProjectEnv(): string {
  const root = resolveProjectRoot();
  mergeEnvFile(join(root, ".env"), false);
  mergeEnvFile(join(root, ".env.local"), true);
  return root;
}
