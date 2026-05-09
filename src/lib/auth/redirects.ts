/**
 * Helpers para construir URLs absolutas de auth a partir de env vars.
 *
 * El backend Supabase no puede inferir el origen del frontend; los emails de
 * confirmación y reset password necesitan una URL explícita. Estas vars también
 * deben coincidir con la allowlist en Supabase Dashboard → Authentication →
 * URL Configuration.
 *
 * Importante: los accesos a `process.env.NEXT_PUBLIC_*` son LITERALES estáticos
 * a propósito. El bundler de Next.js sólo inlinea esos valores en el bundle del
 * cliente cuando el acceso es estático; usar `process.env[name]` con bracket
 * dinámico dejaría `undefined` en client bundles aunque la var exista en
 * `.env.local`.
 */

export function getAppUrl(): string {
  const value = process.env.NEXT_PUBLIC_APP_URL;
  if (!value) {
    throw new Error("Missing required env var: NEXT_PUBLIC_APP_URL");
  }
  return value.replace(/\/$/, "");
}

export function getAuthCallbackUrl(): string {
  const path = process.env.NEXT_PUBLIC_AUTH_CALLBACK_PATH ?? "/auth/callback";
  return `${getAppUrl()}${path}`;
}

export function getRecoveryRedirectUrl(): string {
  const path =
    process.env.NEXT_PUBLIC_AUTH_RECOVERY_REDIRECT_PATH ??
    "/auth/update-password";
  return `${getAppUrl()}${path}`;
}
