import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

/**
 * Supabase client para Server Components, Route Handlers y Server Actions.
 *
 * IMPORTANTE — patrón obligatorio:
 * - Cookies API: usar SIEMPRE `getAll`/`setAll`. El patrón antiguo `get`/`set`
 *   está deprecado y silenciosamente no refresca cookies en algunos casos.
 * - Para checks de autorización usar SIEMPRE `supabase.auth.getUser()` (verifica
 *   firma JWT contra el server). NUNCA `getSession()` (lee cookie sin verificar).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll en Server Components (sin route handler) tira por diseño;
            // ignoramos porque el proxy ya refrescó las cookies para esta request.
          }
        },
      },
    },
  );
}
