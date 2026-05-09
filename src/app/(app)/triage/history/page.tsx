import { PagePlaceholder } from "@/components/shared/PagePlaceholder";

export const metadata = { title: "Histórico de triages — CLEOM" };

export default function Page() {
  return (
    <PagePlaceholder
      title="Histórico de triages"
      description="Tus triages previos."
      todos={[
        "Portar TriageHistoryPage.tsx",
        "Conectar useClinicalHistory para listar triages",
      ]}
      sourceFile="cleom-Merge/src/pages/TriageHistoryPage.tsx"
    />
  );
}
