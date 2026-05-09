import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RecoveryForm } from "@/components/auth/RecoveryForm";

export const metadata = { title: "Recuperar contraseña — CLEOM" };

export default function RecoveryPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recuperar contraseña</CardTitle>
        <CardDescription>
          Te enviamos un link para crear una nueva.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RecoveryForm />
      </CardContent>
    </Card>
  );
}
