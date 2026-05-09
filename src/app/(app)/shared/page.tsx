import { PagePlaceholder } from "@/components/shared/PagePlaceholder";

export const metadata = { title: "Compartidos — CLEOM" };

export default function Page() {
  return (
    <PagePlaceholder
      title="Compartidos"
      description="Documentos clínicos compartidos contigo."
      todos={[
        "Portar SharedPage.tsx",
      ]}
      sourceFile="cleom-Merge/src/pages/SharedPage.tsx"
    />
  );
}
