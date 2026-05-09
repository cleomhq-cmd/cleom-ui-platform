import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /auth/callback?token_hash=...&type=...&next=...
 *
 * Verifica el token de un email de Supabase (signup, recovery, magic link,
 * email_change, invite) usando `verifyOtp`. Este flow NO usa PKCE — no depende
 * de un `code_verifier` guardado en cookies del navegador — por lo tanto no se
 * rompe si el email se abre en otro browser, en incógnito, o tras borrar
 * cookies.
 *
 * Configuración requerida en Supabase Dashboard → Authentication → Email
 * Templates (los templates por defecto usan `{{ .ConfirmationURL }}`, que
 * dispara el flow PKCE; hay que reemplazarlo por una URL con `{{ .TokenHash }}`):
 *
 *   Confirm signup:
 *     <a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=signup&next=/dashboard">
 *       Confirmar mi cuenta
 *     </a>
 *
 *   Reset password:
 *     <a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=recovery&next=/auth/update-password">
 *       Restablecer contraseña
 *     </a>
 *
 *   (Magic link / Invite / Email change: análogos, ajustar `type` y `next`.)
 *
 * También verificar Authentication → URL Configuration → Site URL: debe
 * coincidir con NEXT_PUBLIC_APP_URL (`http://localhost:3002` en dev).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/dashboard";

  if (!tokenHash || !type) {
    return NextResponse.redirect(
      `${origin}/auth/login?error=${encodeURIComponent("Link inválido o expirado.")}`,
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });

  if (error) {
    return NextResponse.redirect(
      `${origin}/auth/login?error=${encodeURIComponent(error.message)}`,
    );
  }

  return NextResponse.redirect(`${origin}${next}`);
}
