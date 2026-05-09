import { PagePlaceholder } from "@/components/shared/PagePlaceholder";

export const metadata = { title: "Solicitudes de doctor — CLEOM" };

export default function Page() {
  return (
    <PagePlaceholder
      title="Solicitudes de doctor"
      description="Listado de aplicaciones para revisar."
      todos={[
        "Portar AdminDoctorApplicationsPage.tsx",
        "AdminGuard server-side",
      ]}
      sourceFile="cleom-Merge/src/pages/admin/AdminDoctorApplicationsPage.tsx"
    />
  );
}
