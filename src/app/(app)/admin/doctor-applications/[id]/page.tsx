import { PagePlaceholder } from "@/components/shared/PagePlaceholder";

export const metadata = { title: "Solicitud — CLEOM" };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PagePlaceholder
      title="Detalle de solicitud"
      description={`Aplicación ${id} — aprobar o rechazar.`}
      todos={[
        "Portar AdminDoctorApplicationDetailPage.tsx",
        "Acciones approve/reject mutating doctor_applications + profiles.role",
      ]}
      sourceFile="cleom-Merge/src/pages/admin/AdminDoctorApplicationDetailPage.tsx"
    />
  );
}
