"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { UserMenu } from "./UserMenu";
import {
  getBackDestination,
  getPageTitle,
  hasBackButton,
} from "./navigation.config";

interface AppHeaderProps {
  className?: string;
}

export function AppHeader({ className = "" }: AppHeaderProps) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const pageTitle = getPageTitle(pathname);
  const showBack = hasBackButton(pathname);
  const backDestination = getBackDestination(pathname);
  const isHome = pathname === "/dashboard" || pathname === "/ai";

  return (
    <header
      className={`sticky top-0 z-40 safe-area-top transition-all duration-300 ${
        isScrolled
          ? "frosted border-b border-white/[0.06] shadow-sm"
          : "bg-transparent"
      } ${className}`}
    >
      <div className="grid grid-cols-3 items-center h-12 px-4 max-w-lg mx-auto">
        <div className="flex items-center gap-2 justify-start">
          {showBack ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={() => router.push(backDestination)}
              aria-label="Volver"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          ) : isHome ? (
            <Logo size="sm" />
          ) : null}
        </div>

        <div className="flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.h1
              key={pageTitle}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-semibold text-foreground tracking-wide"
            >
              {pageTitle}
            </motion.h1>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-end">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
