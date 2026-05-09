import { PagePlaceholder } from "@/components/shared/PagePlaceholder";

export const metadata = { title: "Resúmenes — CLEOM" };

export default function Page() {
  return (
    <PagePlaceholder
      title="Resúmenes"
      description="Resúmenes generados por IA de tu historia."
      todos={[
        "Portar SummariesPage.tsx",
        "Conectar useClinicalSummaries hook",
      ]}
      sourceFile="cleom-Merge/src/pages/SummariesPage.tsx"
    />
  );
}
