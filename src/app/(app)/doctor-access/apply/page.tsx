import { PagePlaceholder } from "@/components/shared/PagePlaceholder";

export const metadata = { title: "Solicitud de doctor — CLEOM" };

export default function Page() {
  return (
    <PagePlaceholder
      title="Solicitud de doctor"
      description="Formulario de credenciales y especialidad."
      todos={[
        "Portar DoctorApplyPage.tsx",
        "Validación con react-hook-form + zod",
        "Insert en doctor_applications",
      ]}
      sourceFile="cleom-Merge/src/pages/doctor-access/DoctorApplyPage.tsx"
    />
  );
}
