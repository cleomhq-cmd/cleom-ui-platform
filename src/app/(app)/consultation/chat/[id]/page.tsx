import { PagePlaceholder } from "@/components/shared/PagePlaceholder";

export const metadata = { title: "Consulta — CLEOM" };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PagePlaceholder
      title="Consulta médica"
      description={`Chat de consulta ${id}.`}
      todos={[
        "Portar ConsultationChatPage.tsx",
        "Conectar useTriageConversations adaptado a consultations",
      ]}
      sourceFile="cleom-Merge/src/pages/ConsultationChatPage.tsx"
    />
  );
}
