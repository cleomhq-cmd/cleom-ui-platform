import { PagePlaceholder } from "@/components/shared/PagePlaceholder";

export const metadata = { title: "Iniciar triage — CLEOM" };

export default function Page() {
  return (
    <PagePlaceholder
      title="Iniciar triage"
      description="Evaluación inteligente de síntomas."
      todos={[
        "Portar TriageStartPage.tsx (immersive — hide header/nav)",
        "Conectar useBaselineStatus hook",
        "Conectar Edge Functions triage-baseline / triage-ai",
      ]}
      sourceFile="cleom-Merge/src/pages/TriageStartPage.tsx"
    />
  );
}
