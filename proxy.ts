// Next.js 16 renamed `middleware.ts` → `proxy.ts`. La función exportada se
// llama `proxy` en lugar de `middleware`. La lógica interna es la misma:
// refrescar la sesión Supabase via cookies y proteger rutas privadas.
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Excluir assets estáticos, imágenes optimizadas y archivos públicos.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
