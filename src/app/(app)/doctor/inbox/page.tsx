import { PagePlaceholder } from "@/components/shared/PagePlaceholder";

export const metadata = { title: "Bandeja médica — CLEOM" };

export default function Page() {
  return (
    <PagePlaceholder
      title="Bandeja médica"
      description="Triages en cola y casos asignados."
      todos={[
        "Portar DoctorInboxPage.tsx",
        "Conectar RPC rpc_get_doctor_inbox_v1",
      ]}
      sourceFile="cleom-Merge/src/pages/doctor/DoctorInboxPage.tsx"
    />
  );
}
