import { PagePlaceholder } from "@/components/shared/PagePlaceholder";

export const metadata = { title: "Triage — CLEOM" };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PagePlaceholder
      title="Triage chat"
      description={`Chat interactivo con IA (sesión ${id}).`}
      todos={[
        "Portar TriageChatPage.tsx (full-screen)",
        "Conectar useTriageConversations hook",
        "Streaming desde Edge Function cleom-triage",
      ]}
      sourceFile="cleom-Merge/src/pages/TriageChatPage.tsx"
    />
  );
}
