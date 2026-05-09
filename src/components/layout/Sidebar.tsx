"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Settings, type LucideIcon } from "lucide-react";
import type { ComponentType } from "react";
import { Logo } from "@/components/shared/Logo";
import { useUserRole } from "@/hooks/useUserRole";
import {
  DOCTOR_TAB,
  NAV_TABS,
  getActiveTab,
  type NavTabConfig,
} from "./navigation.config";

const SETTINGS_ITEM: NavTabConfig = {
  id: "settings",
  label: "Ajustes",
  icon: Settings,
  href: "/settings",
};

interface SidebarProps {
  isCollapsed?: boolean;
}

export function Sidebar({ isCollapsed = false }: SidebarProps) {
  const pathname = usePathname() ?? "/";
  const { canActAsDoctor, loading } = useUserRole();

  const items = loading
    ? NAV_TABS
    : canActAsDoctor
      ? [...NAV_TABS, DOCTOR_TAB]
      : NAV_TABS;

  const activeId = pathname.startsWith("/settings")
    ? "settings"
    : getActiveTab(pathname);

  function renderNavLink(item: {
    id: string;
    label: string;
    icon: LucideIcon | ComponentType<{ className?: string; strokeWidth?: number }>;
    href: string;
    featured?: boolean;
  }) {
    const isActive = activeId === item.id;
    const Icon = item.icon;

    return (
      <Link
        key={item.id}
        href={item.href}
        className={`group relative w-full flex items-center gap-3 rounded-lg transition-all duration-200 ${
          isCollapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"
        } ${
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
        title={isCollapsed ? item.label : undefined}
      >
        {isActive && (
          <motion.div
            layoutId="sidebarActive"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-primary"
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          />
        )}

        {item.featured ? (
          <Logo
            size="sm"
            className={`flex-shrink-0 [&_img]:!h-5 [&_img]:!w-auto ${
              isActive
                ? "opacity-100"
                : "opacity-50 group-hover:opacity-80"
            }`}
          />
        ) : (
          <Icon
            className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-primary" : ""}`}
            strokeWidth={isActive ? 2.5 : 2}
          />
        )}

        {!isCollapsed && (
          <span
            className={`text-sm font-medium ${isActive ? "text-primary" : ""}`}
          >
            {item.label}
          </span>
        )}
      </Link>
    );
  }

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-40 bg-background border-r border-border/50 flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-56"
      }`}
    >
      <div
        className={`flex items-center h-14 border-b border-border/50 ${
          isCollapsed ? "justify-center px-2" : "px-4"
        }`}
      >
        <Logo size="sm" />
      </div>

      <nav className="flex-1 py-3 px-2 space-y-1">
        {items.map(renderNavLink)}
      </nav>

      <div className="py-3 px-2 border-t border-border/50">
        {renderNavLink(SETTINGS_ITEM)}
      </div>
    </aside>
  );
}
