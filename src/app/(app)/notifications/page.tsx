import { PagePlaceholder } from "@/components/shared/PagePlaceholder";

export const metadata = { title: "Alertas — CLEOM" };

export default function Page() {
  return (
    <PagePlaceholder
      title="Alertas"
      description="Notificaciones y alertas activas."
      todos={[
        "Portar NotificationsPage.tsx",
        "Conectar useNotifications a tabla real",
        "Realtime subscription para inbox push",
      ]}
      sourceFile="cleom-Merge/src/pages/NotificationsPage.tsx"
    />
  );
}
