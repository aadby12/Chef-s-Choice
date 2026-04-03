import { defaultOgImageResponse } from "@/lib/og-image";

export const dynamic = "force-dynamic";

/** Route handler avoids next-metadata-route-loader (breaks when project path contains `'`). */
export async function GET() {
  return defaultOgImageResponse();
}
