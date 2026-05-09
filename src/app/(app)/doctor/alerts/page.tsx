import { PagePlaceholder } from "@/components/shared/PagePlaceholder";

export const metadata = { title: "Alertas médicas — CLEOM" };

export default function Page() {
  return (
    <PagePlaceholder
      title="Alertas médicas"
      description="Alertas que requieren atención clínica."
      todos={[
        "Portar DoctorAlertsPage.tsx",
      ]}
      sourceFile="cleom-Merge/src/pages/doctor/DoctorAlertsPage.tsx"
    />
  );
}
