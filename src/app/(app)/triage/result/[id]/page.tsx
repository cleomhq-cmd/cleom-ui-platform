import { PagePlaceholder } from "@/components/shared/PagePlaceholder";

export const metadata = { title: "Resultado — CLEOM" };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PagePlaceholder
      title="Resultado del triage"
      description={`Recomendaciones para la sesión ${id}.`}
      todos={[
        "Portar TriageResultPage.tsx",
        "Conectar useTriageSessions hook",
      ]}
      sourceFile="cleom-Merge/src/pages/TriageResultPage.tsx"
    />
  );
}
