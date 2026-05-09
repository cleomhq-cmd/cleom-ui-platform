import Link from "next/link";
import { Activity, FileText, MessageCircle, Stethoscope } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = { title: "Mi salud hoy — CLEOM" };

const QUICK_ACTIONS = [
  {
    href: "/ai",
    title: "Hablar con Cleom AI",
    description: "Resolvé dudas de salud en segundos.",
    icon: MessageCircle,
  },
  {
    href: "/triage/start",
    title: "Iniciar triage",
    description: "Evaluación inteligente de síntomas.",
    icon: Activity,
  },
  {
    href: "/wallet",
    title: "Tu cartera de salud",
    description: "Historia clínica unificada.",
    icon: FileText,
  },
  {
    href: "/telemedicine",
    title: "Atención médica",
    description: "Conectate con un profesional.",
    icon: Stethoscope,
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const fullName =
    (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
    user.email?.split("@")[0] ??
    "ahí";

  return (
    <div className="container py-8 md:py-12 max-w-4xl space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-3xl md:text-4xl font-semibold">
          Hola, {fullName} 👋
        </h1>
        <p className="text-muted-foreground">
          Esto es lo que podés hacer hoy con tu salud.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {QUICK_ACTIONS.map(({ href, title, description, icon: Icon }) => (
          <Link key={href} href={href} className="group">
            <Card className="h-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-medium">
              <CardHeader className="space-y-3">
                <div className="rounded-lg bg-primary/10 p-2.5 w-fit text-primary">
                  <Icon className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Datos de sesión (debug — Fase 5 reemplaza esto con HealthDashboardHero/MetricCard reales)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5 text-sm">
          <div>
            <span className="text-muted-foreground">Email:</span>{" "}
            <span className="font-medium">{user.email}</span>
          </div>
          <div>
            <span className="text-muted-foreground">User ID:</span>{" "}
            <code className="text-xs">{user.id}</code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
