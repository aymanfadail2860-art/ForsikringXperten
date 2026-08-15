"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signIn, type ActionResult } from "../actions";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" fullWidth disabled={pending}>
      {pending ? "Logger ind …" : "Log ind"}
    </Button>
  );
}

export function LoginForm({ next, notice }: { next: string; notice?: string }) {
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    signIn,
    null,
  );

  return (
    <form action={formAction} className="mt-6 space-y-4">
      {notice ? <Alert tone="warning">{notice}</Alert> : null}
      {state?.error ? <Alert tone="danger">{state.error}</Alert> : null}

      <input type="hidden" name="next" value={next} />

      <TextField
        label="E-mail"
        name="email"
        type="email"
        required
        autoComplete="username"
        autoFocus
      />
      <TextField
        label="Adgangskode"
        name="password"
        type="password"
        required
        autoComplete="current-password"
      />

      <SubmitButton />
    </form>
  );
}
