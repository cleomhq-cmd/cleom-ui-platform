"use client";

import { useCurrentProfile } from "./useCurrentProfile";

export function useUserRole() {
  const { profile, loading } = useCurrentProfile();

  const role = profile?.role ?? "patient";
  const doctorStatus = profile?.doctor_status ?? "none";

  return {
    role,
    doctorStatus,
    isPatient: role === "patient",
    isDoctor: role === "doctor",
    isAdmin: role === "admin",
    canActAsDoctor: role === "doctor" && doctorStatus === "approved",
    loading,
  };
}
