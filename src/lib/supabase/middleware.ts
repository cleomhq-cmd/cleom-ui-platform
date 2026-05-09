import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

/**
 * Supabase session refresher para `proxy.ts` (Next 16 ex-middleware.ts).
 *
 * Responsabilidades:
 * 1. Sincronizar cookies entre request y response (patrón `getAll`/`setAll`).
 * 2. Llamar `supabase.auth.getUser()` para verificar JWT y refrescar el access
 *    token si está por expirar.
 * 3. Redirigir según estado: sin sesión → /auth/login (excepto rutas /auth/*),
 *    con sesión en ruta /auth/* (excepto /auth/callback y /auth/update-password)
 *    → /dashboard.
 *
 * NUNCA usar `getSession()` para autorizar — sólo `getUser()` valida la firma.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // CRITICAL: getUser() verifica el JWT contra el server. NO cambiar a getSession().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAuthRoute = pathname.startsWith("/auth");
  // Estas rutas necesitan ejecutarse aunque el usuario no esté autenticado
  // (callback canjea el code, update-password se sirve antes de loguearse del todo).
  const isAuthCallback =
    pathname.startsWith("/auth/callback") ||
    pathname.startsWith("/auth/update-password");

  if (!user && !isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute && !isAuthCallback) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
