import { CATALOG_MEDIA } from "@/lib/catalog-local-images";

/** Copy into `public/images/catalog/` via `npm run images:sync` (rules: Mini_Skillet → login, Staub Tomato → signup). */
export const AUTH_HERO = {
  login: "/images/catalog/auth-login-hero.png",
  signup: "/images/catalog/auth-signup-hero.png",
} as const;

/** Fallbacks if sync hasn’t run yet — still looks on-brand. */
export const AUTH_HERO_FALLBACK = {
  login: CATALOG_MEDIA.lifestyleEnameled,
  signup: CATALOG_MEDIA.heroCreuset,
} as const;
