"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client para Client Components. Lee/escribe cookies del browser.
 * No usar para checks de autorización — esos van en server.ts con getUser().
 *
 * flowType "implicit": signup/recovery emiten un `token_hash` simple en vez de
 * PKCE-style (`pkce_*`). Eso permite que el link del email se abra en cualquier
 * navegador o sesión sin depender de un `code_verifier` cookie persistido en
 * el browser donde se hizo el signup. PKCE protege principalmente contra
 * interception del code en flows OAuth; como esta app sólo usa email/password
 * + email magic links, PKCE no aporta seguridad relevante y rompe la UX.
 *
 * Si más adelante se agrega `signInWithOAuth` (Google / GitHub / etc.),
 * revisitar — ahí PKCE sí mitiga interception y conviene volver al default.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { flowType: "implicit" } },
  );
}
