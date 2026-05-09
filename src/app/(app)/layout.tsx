import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";

/**
 * Layout protegido. El proxy.ts ya redirige a /auth/login si no hay sesión;
 * acá hacemos defense-in-depth con getUser() server-side.
 *
 * IMPORTANTE: usar SIEMPRE getUser() (verifica firma JWT). NO getSession().
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return <AppShell>{children}</AppShell>;
}
