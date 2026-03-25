import { AUTH_HERO, AUTH_HERO_FALLBACK } from "@/lib/auth-images";
import { resolvePublicAsset } from "@/lib/resolve-public-asset";
import { SignupClient } from "./signup-client";

export default function SignupPage() {
  const heroSrc = resolvePublicAsset(AUTH_HERO.signup, AUTH_HERO_FALLBACK.signup);
  return <SignupClient heroSrc={heroSrc} />;
}
