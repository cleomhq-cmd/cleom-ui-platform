import { PagePlaceholder } from "@/components/shared/PagePlaceholder";

export const metadata = { title: "Historia Clínica — CLEOM" };

export default function Page() {
  return (
    <PagePlaceholder
      title="Historia Clínica"
      description="Datos clínicos centralizados."
      todos={[
        "Portar ClinicalHistoryPage.tsx",
        "Reusar formatClinicalHistoryContent helper",
      ]}
      sourceFile="cleom-Merge/src/pages/ClinicalHistoryPage.tsx"
    />
  );
}
