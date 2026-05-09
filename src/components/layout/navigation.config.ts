import {
  Bell,
  Bot,
  House,
  Stethoscope,
  Video,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { ComponentType } from "react";

export interface NavTabConfig {
  id: string;
  label: string;
  icon: LucideIcon | ComponentType<{ className?: string; strokeWidth?: number }>;
  href: string;
  featured?: boolean;
}

export const NAV_TABS: NavTabConfig[] = [
  { id: "salud", label: "Inicio", icon: House, href: "/dashboard" },
  { id: "wallet", label: "Cartera", icon: Wallet, href: "/wallet" },
  { id: "ai", label: "Cleom AI", icon: Bot, href: "/ai", featured: true },
  { id: "telemedicine", label: "Atención", icon: Video, href: "/telemedicine" },
  { id: "alertas", label: "Alertas", icon: Bell, href: "/notifications" },
];

export const DOCTOR_TAB: NavTabConfig = {
  id: "doctor",
  label: "Doctor",
  icon: Stethoscope,
  href: "/doctor/inbox",
};

const TAB_MATCH_MAP: Record<string, string[]> = {
  salud: ["/dashboard"],
  wallet: ["/wallet", "/shared"],
  ai: ["/ai", "/ai-copilot"],
  telemedicine: ["/telemedicine"],
  alertas: ["/notifications"],
  doctor: ["/doctor"],
};

const HIDE_NAV_PATHS = [
  "/triage/start",
  "/triage/history",
  "/triage/chat/",
  "/triage/result/",
  "/consultation/chat/",
];

const HIDE_HEADER_PATHS = [
  "/triage/start",
  "/triage/history",
  "/triage/chat/",
  "/triage/result/",
  "/consultation/chat/",
];

export const ROUTE_TITLES: Record<string, string> = {
  "/dashboard": "Mi salud hoy",
  "/wallet": "Cartera de Salud",
  "/wallet/timeline": "Timeline",
  "/wallet/summaries": "Resúmenes",
  "/wallet/clinical-history": "Historia Clínica",
  "/ai-copilot": "Cleom AI",
  "/ai": "Cleom AI",
  "/settings": "Ajustes",
  "/telemedicine": "Atención Médica",
  "/triage/start": "Cleom AI",
  "/shared": "Compartidos",
  "/doctor/dashboard": "Panel Médico",
  "/doctor/inbox": "Bandeja",
  "/doctor/patients": "Pacientes",
  "/doctor/consultations": "Consultas",
  "/doctor/alerts": "Alertas",
  "/notifications": "Alertas",
};

export const DYNAMIC_ROUTE_TITLES: Array<{ pattern: RegExp; title: string }> = [
  { pattern: /^\/triage\/result\//, title: "Resultado Triage" },
  { pattern: /^\/consultation\/chat\//, title: "Consulta Médica" },
  { pattern: /^\/doctor\/case\//, title: "Caso" },
];

const BACK_ROUTES = [
  "/wallet/timeline",
  "/wallet/summaries",
  "/wallet/clinical-history",
  "/triage/start",
  "/triage/result",
  "/shared",
  "/doctor/dashboard",
  "/settings",
];

const BACK_DESTINATIONS: Record<string, string> = {
  "/wallet/timeline": "/wallet",
  "/wallet/summaries": "/wallet",
  "/wallet/clinical-history": "/wallet",
  "/triage/start": "/ai",
  "/triage/result": "/ai",
  "/shared": "/wallet",
  "/doctor/dashboard": "/dashboard",
  "/settings": "/dashboard",
};

const pathMatches = (pathname: string, route: string) =>
  route.endsWith("/")
    ? pathname.startsWith(route)
    : pathname === route || pathname.startsWith(`${route}/`);

export function getActiveTab(pathname: string): string {
  for (const [tabId, routes] of Object.entries(TAB_MATCH_MAP)) {
    if (routes.some((route) => pathMatches(pathname, route))) return tabId;
  }
  return "salud";
}

export function shouldHideNav(pathname: string): boolean {
  return HIDE_NAV_PATHS.some((route) => pathMatches(pathname, route));
}

export function shouldHideHeader(pathname: string): boolean {
  return HIDE_HEADER_PATHS.some((route) => pathMatches(pathname, route));
}

export function getPageTitle(pathname: string): string {
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];
  const dynamic = DYNAMIC_ROUTE_TITLES.find((r) => r.pattern.test(pathname));
  return dynamic?.title ?? "";
}

export function hasBackButton(pathname: string): boolean {
  return BACK_ROUTES.some((route) => pathname.startsWith(route));
}

export function getBackDestination(pathname: string): string {
  return (
    Object.entries(BACK_DESTINATIONS).find(([route]) =>
      pathname.startsWith(route),
    )?.[1] ?? "/dashboard"
  );
}
