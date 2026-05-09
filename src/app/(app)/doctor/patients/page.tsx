import { PagePlaceholder } from "@/components/shared/PagePlaceholder";

export const metadata = { title: "Pacientes — CLEOM" };

export default function Page() {
  return (
    <PagePlaceholder
      title="Pacientes"
      description="Listado de pacientes activos."
      todos={[
        "Portar DoctorPatientsPage.tsx",
      ]}
      sourceFile="cleom-Merge/src/pages/doctor/DoctorPatientsPage.tsx"
    />
  );
}
