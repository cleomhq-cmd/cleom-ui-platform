"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Hook que devuelve el número de notificaciones no leídas para el badge del
 * BottomNavBar. Por ahora hace una query simple a una tabla `notifications`;
 * si la tabla no existe aún, devuelve 0 sin error.
 *
 * TODO Fase 5: conectar a la tabla real de notifications + realtime subscription.
 */
export function useNotifications() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { count } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("read", false);

      if (!cancelled && typeof count === "number") {
        setUnreadCount(count);
      }
    }

    load().catch(() => {
      // Tabla no existe aún → mantener 0.
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { unread_count: unreadCount };
}
