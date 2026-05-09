import { PagePlaceholder } from "@/components/shared/PagePlaceholder";

export const metadata = { title: "Ajustes — CLEOM" };

export default function Page() {
  return (
    <PagePlaceholder
      title="Ajustes"
      description="Tu cuenta, perfil y preferencias."
      todos={[
        "Portar SettingsPage.tsx",
        "Reemplazar UserProfile (Clerk) por flow custom: cambio email/password/MFA via supabase.auth.updateUser",
        "AppMode toggle (patient/doctor) en localStorage",
      ]}
      sourceFile="cleom-Merge/src/pages/SettingsPage.tsx"
    />
  );
}
