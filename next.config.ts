import type { NextConfig } from "next";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Next generates `.next/types/routes.d.ts` but `validator.ts` imports `./routes.js`.
 * TypeScript should map that import to the `.d.ts` file but sometimes does not
 * (e.g. certain Windows / resolution setups), which breaks `next build`.
 * A tiny empty JS module lets `import type … from "./routes.js"` resolve.
 */
function ensureNextRoutesJsStub(): void {
  const typesDir = join(process.cwd(), ".next", "types");
  const jsPath = join(typesDir, "routes.js");
  const dtsPath = join(typesDir, "routes.d.ts");
  if (!existsSync(dtsPath) || existsSync(jsPath)) return;
  mkdirSync(typesDir, { recursive: true });
  writeFileSync(
    jsPath,
    "// Stub: types live in routes.d.ts; satisfies validator's `./routes.js` import.\nexport {}\n",
  );
}

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  { protocol: "https", hostname: "images.unsplash.com" },
  { protocol: "https", hostname: "picsum.photos" },
  { protocol: "https", hostname: "placehold.co" },
];

if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  try {
    const host = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname;
    remotePatterns.push({
      protocol: "https",
      hostname: host,
      pathname: "/storage/v1/object/public/**",
    });
  } catch {
    /* ignore invalid env */
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  webpack(config) {
    const stubPlugin = {
      apply(compiler: {
        hooks: {
          done: { tap: (name: string, fn: () => void) => void };
        };
      }) {
        compiler.hooks.done.tap("ensure-next-routes-js-stub", ensureNextRoutesJsStub);
      },
    };
    config.plugins = [...(config.plugins ?? []), stubPlugin];
    return config;
  },
};

export default nextConfig;
