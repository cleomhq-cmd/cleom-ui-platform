"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useUserRole } from "@/hooks/useUserRole";
import {
  DOCTOR_TAB,
  NAV_TABS,
  getActiveTab,
  shouldHideNav,
  type NavTabConfig,
} from "./navigation.config";

interface BottomNavBarProps {
  className?: string;
  unread_count?: number;
}

export function BottomNavBar({
  className = "",
  unread_count = 0,
}: BottomNavBarProps) {
  const pathname = usePathname() ?? "/";
  const { canActAsDoctor, loading } = useUserRole();

  const navTabs: NavTabConfig[] = loading
    ? NAV_TABS
    : canActAsDoctor
      ? [...NAV_TABS, DOCTOR_TAB]
      : NAV_TABS;

  if (shouldHideNav(pathname)) return null;
  const activeTab = getActiveTab(pathname);

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 safe-area-bottom ${className}`}
    >
      <div className="frosted border-t border-white/[0.06] overflow-visible">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2 overflow-visible">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            const hasBadge = tab.id === "alertas" && unread_count > 0;

            if (tab.featured) {
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className="relative flex flex-col items-center justify-center w-full h-full gap-0.5 group"
                  aria-label={tab.label}
                  aria-current={isActive ? "page" : undefined}
                >
                  <div
                    className={`-mt-7 w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-b from-primary to-primary/80 shadow-[0_4px_24px_hsl(var(--primary)/0.55)] transition-all duration-200 group-active:scale-95 ${
                      isActive
                        ? "ring-[3px] ring-primary/30 ring-offset-2 ring-offset-background"
                        : ""
                    }`}
                  >
                    <Image
                      src="/brand/logo-dark.png"
                      alt="Cleom"
                      width={32}
                      height={32}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <span
                    className={`text-[10px] font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={tab.id}
                href={tab.href}
                className="relative flex flex-col items-center justify-center w-full h-full gap-0.5 group"
                aria-label={tab.label}
                aria-current={isActive ? "page" : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-0.5 w-8 h-1 rounded-full bg-primary glow-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <div className="relative flex items-center justify-center w-10 h-7 rounded-full transition-colors duration-200">
                  <Icon
                    className={`w-[22px] h-[22px] transition-all duration-200 ${
                      isActive
                        ? "text-primary drop-shadow-[0_0_6px_hsl(var(--primary)/0.4)]"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                  {hasBadge && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">
                      {unread_count > 9 ? "9+" : unread_count}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
