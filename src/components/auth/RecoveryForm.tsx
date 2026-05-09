"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { getRecoveryRedirectUrl } from "@/lib/auth/redirects";

export function RecoveryForm() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getRecoveryRedirectUrl(),
    });
    setPending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSubmitted(true);
    toast.success("Si el email existe, te enviamos un link para resetear.");
  }

  if (submitted) {
    return (
      <div className="space-y-3 text-center">
        <h2 className="font-display text-2xl font-semibold">Revisá tu email</h2>
        <p className="text-sm text-muted-foreground">
          Si <strong>{email}</strong> está registrado, te llegará un link para
          establecer una contraseña nueva.
        </p>
        <Link
          href="/auth/login"
          className="inline-block text-sm text-primary hover:underline"
        >
          Volver al login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
        />
        <p className="text-xs text-muted-foreground">
          Te enviaremos un link a tu email para que puedas crear una nueva
          contraseña.
        </p>
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Enviando…" : "Enviar link de recuperación"}
      </Button>
      <p className="text-sm text-center text-muted-foreground">
        <Link
          href="/auth/login"
          className="text-primary font-medium hover:underline"
        >
          Volver al login
        </Link>
      </p>
    </form>
  );
}
