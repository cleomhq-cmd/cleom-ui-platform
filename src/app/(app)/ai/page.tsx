import { PagePlaceholder } from "@/components/shared/PagePlaceholder";

export const metadata = { title: "Cleom AI — CLEOM" };

export default function Page() {
  return (
    <PagePlaceholder
      title="Cleom AI"
      description="Tu copilot de salud impulsado por IA."
      todos={[
        "Portar CleomAIPage.tsx",
        "Conectar useAIHealthCopilot hook",
        "Edge Function ai-health-copilot",
      ]}
      sourceFile="cleom-Merge/src/pages/CleomAIPage.tsx"
    />
  );
}
