import { PagePlaceholder } from "@/components/shared/PagePlaceholder";

export const metadata = { title: "Timeline — CLEOM" };

export default function Page() {
  return (
    <PagePlaceholder
      title="Timeline"
      description="Línea de tiempo de eventos clínicos."
      todos={[
        "Portar TimelinePage.tsx",
        "Reusar HealthSystem timeline component",
      ]}
      sourceFile="cleom-Merge/src/pages/TimelinePage.tsx"
    />
  );
}
