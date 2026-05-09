"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "patient" | "doctor" | "admin";
  doctor_status: "none" | "pending" | "approved" | "rejected";
  onboarding_completed_at: string | null;
}

/**
 * Hook que devuelve el profile del usuario activo. Lee la sesión Supabase
 * y resuelve la row en `public.profiles` correspondiente a `auth.uid()`.
 *
 * Si la tabla profiles aún no se aplicó (Fase 2 SQL pendiente), cae al
 * fallback de `auth.users` (id, email, raw_user_meta_data.full_name).
 */
export function useCurrentProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (!cancelled) {
          setProfile(null);
          setLoading(false);
        }
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (cancelled) return;

      if (error || !data) {
        // Fallback a auth.users si la tabla profiles no existe aún.
        setProfile({
          id: user.id,
          email: user.email ?? "",
          full_name:
            (user.user_metadata?.full_name as string | undefined) ?? null,
          avatar_url:
            (user.user_metadata?.avatar_url as string | undefined) ?? null,
          role: "patient",
          doctor_status: "none",
          onboarding_completed_at: null,
        });
      } else {
        setProfile(data as Profile);
      }
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { profile, loading };
}
