import { PagePlaceholder } from "@/components/shared/PagePlaceholder";

export const metadata = { title: "Estado de solicitud — CLEOM" };

export default function Page() {
  return (
    <PagePlaceholder
      title="Estado de solicitud"
      description="Pending / approved / rejected."
      todos={[
        "Portar DoctorAccessStatusPage.tsx",
      ]}
      sourceFile="cleom-Merge/src/pages/doctor-access/DoctorAccessStatusPage.tsx"
    />
  );
}
