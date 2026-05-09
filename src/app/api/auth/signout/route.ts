import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/auth/signout
 *
 * Server-side signOut: invalida el refresh token en Supabase y limpia las
 * cookies de sesión. Después redirige a /auth/login.
 *
 * Form-friendly: <form action="/api/auth/signout" method="post"> ... </form>
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const url = new URL("/auth/login", request.url);
  return NextResponse.redirect(url, { status: 303 });
}
