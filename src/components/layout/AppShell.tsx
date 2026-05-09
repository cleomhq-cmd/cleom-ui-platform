"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AppHeader } from "./AppHeader";
import { BottomNavBar } from "./BottomNavBar";
import { Sidebar } from "./Sidebar";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";
import { useNotifications } from "@/hooks/useNotifications";
import { shouldHideHeader, shouldHideNav } from "./navigation.config";

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * Layout compartido para rutas autenticadas.
 * Mobile: BottomNavBar. Tablet: Sidebar colapsada. Desktop: Sidebar expandida.
 */
export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname() ?? "/";
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const { unread_count } = useNotifications();

  const hideHeader = shouldHideHeader(pathname);
  const hideNav = shouldHideNav(pathname);

  const useSidebar = !isMobile && !hideNav;
  const useBottomNav = isMobile && !hideNav;

  const sidebarMargin = useSidebar ? (isTablet ? "ml-16" : "ml-56") : "";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {useSidebar && <Sidebar isCollapsed={isTablet} />}

      <div
        className={`flex-1 flex flex-col ${sidebarMargin} transition-all duration-300`}
      >
        {!hideHeader && <AppHeader />}

        <main
          className={`flex-1 flex flex-col ${useBottomNav ? "pb-20" : ""}`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: pathname === "/triage/start" ? 1 : 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: pathname === "/triage/start" ? 0 : 0.15,
              }}
              className="flex-1 flex flex-col min-h-0"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {useBottomNav && <BottomNavBar unread_count={unread_count} />}
    </div>
  );
}
