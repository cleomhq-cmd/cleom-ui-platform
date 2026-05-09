import { PagePlaceholder } from "@/components/shared/PagePlaceholder";

export const metadata = { title: "Cartera de Salud — CLEOM" };

export default function Page() {
  return (
    <PagePlaceholder
      title="Cartera de Salud"
      description="Tu historia clínica unificada y compartible."
      todos={[
        "Portar carrusel de WalletPage.tsx con WALLET_SECTIONS",
        "Conectar useClinicalHistory hook a Supabase",
        "Conectar useBaselineGate hook + BaselineGateDialog",
      ]}
      sourceFile="cleom-Merge/src/pages/WalletPage.tsx"
    />
  );
}
