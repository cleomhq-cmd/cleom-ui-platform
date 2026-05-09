import { PagePlaceholder } from "@/components/shared/PagePlaceholder";

export const metadata = { title: "Caso — CLEOM" };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PagePlaceholder
      title="Detalle del caso"
      description={`Caso ${id}: paciente, historial y acciones clínicas.`}
      todos={[
        "Portar DoctorCasePage.tsx",
        "Conectar useDoctorCase hook",
      ]}
      sourceFile="cleom-Merge/src/pages/doctor/DoctorCasePage.tsx"
    />
  );
}
