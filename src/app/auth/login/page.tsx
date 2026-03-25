import { AUTH_HERO, AUTH_HERO_FALLBACK } from "@/lib/auth-images";
import { resolvePublicAsset } from "@/lib/resolve-public-asset";
import { LoginClient } from "./login-client";

export default function LoginPage() {
  const heroSrc = resolvePublicAsset(AUTH_HERO.login, AUTH_HERO_FALLBACK.login);
  return <LoginClient heroSrc={heroSrc} />;
}
