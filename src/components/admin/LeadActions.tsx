"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  addLeadNote,
  bookMeeting,
  logContactAttempt,
  setFollowUp,
  updateLeadStatus,
  type ActionResult,
} from "@/app/admin/actions";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { leadStatuses } from "@/config/pipeline";
import type { LeadRow } from "@/lib/supabase/types";

/**
 * Lead actions.
 *
 * Each is a plain form posting to a server action, so everything works without
 * client-side state management and the authorisation check cannot be skipped by
 * calling an API directly.
 */

function Pending({ idle, busy }: { idle: string; busy: string }) {
  const { pending } = useFormStatus();
  return <>{pending ? busy : idle}</>;
}

function SubmitButton({
  idle,
  busy,
  variant = "primary",
  size = "sm",
}: {
  idle: string;
  busy: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant={variant} size={size} disabled={pending}>
      <Pending idle={idle} busy={busy} />
    </Button>
  );
}

export function StatusChanger({ lead }: { lead: LeadRow }) {
  const [state, action] = useActionState<ActionResult | null, FormData>(
    updateLeadStatus,
    null,
  );

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="leadId" value={lead.id} />
      <label
        htmlFor="lead-status"
        className="block text-small font-semibold text-ink-800"
      >
        Status
      </label>
      <select
        id="lead-status"
        name="status"
        defaultValue={lead.status}
        className="w-full rounded-lg border border-ink-200 bg-surface px-3.5 py-2.5 text-body"
      >
        {leadStatuses.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label} — {s.description}
          </option>
        ))}
      </select>
      <SubmitButton idle="Gem status" busy="Gemmer …" />
      {state?.error ? <Alert tone="danger">{state.error}</Alert> : null}
    </form>
  );
}

export function ContactAttemptButtons({ leadId }: { leadId: string }) {
  const [state, action] = useActionState<ActionResult | null, FormData>(
    logContactAttempt,
    null,
  );

  return (
    <div>
      <p className="text-small font-semibold text-ink-800">Registrér kontaktforsøg</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <form action={action}>
          <input type="hidden" name="leadId" value={leadId} />
          <input type="hidden" name="reached" value="yes" />
          <SubmitButton idle="Fik fat i kunden" busy="Gemmer …" />
        </form>
        <form action={action}>
          <input type="hidden" name="leadId" value={leadId} />
          <input type="hidden" name="reached" value="no" />
          <SubmitButton idle="Ingen svar" busy="Gemmer …" variant="secondary" />
        </form>
      </div>
      {state?.error ? (
        <div className="mt-2">
          <Alert tone="danger">{state.error}</Alert>
        </div>
      ) : null}
    </div>
  );
}

export function NoteForm({ leadId }: { leadId: string }) {
  const [state, action] = useActionState<ActionResult | null, FormData>(
    addLeadNote,
    null,
  );

  return (
    <form
      action={action}
      className="space-y-3"
      // The note field clears itself on success via the key below.
      key={state?.ok ? "reset" : "editing"}
    >
      <input type="hidden" name="leadId" value={leadId} />
      <label htmlFor="note-body" className="block text-small font-semibold text-ink-800">
        Tilføj note
      </label>
      <textarea
        id="note-body"
        name="body"
        required
        rows={3}
        placeholder="Hvad blev aftalt?"
        className="w-full rounded-lg border border-ink-200 bg-surface px-3.5 py-2.5 text-body"
      />
      <SubmitButton idle="Gem note" busy="Gemmer …" />
      {state?.error ? <Alert tone="danger">{state.error}</Alert> : null}
    </form>
  );
}

export function FollowUpForm({ lead }: { lead: LeadRow }) {
  const [state, action] = useActionState<ActionResult | null, FormData>(
    setFollowUp,
    null,
  );

  // datetime-local wants "YYYY-MM-DDTHH:mm".
  const existing = lead.next_follow_up_at
    ? new Date(lead.next_follow_up_at).toISOString().slice(0, 16)
    : "";

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="leadId" value={lead.id} />
      <label htmlFor="follow-up" className="block text-small font-semibold text-ink-800">
        Næste opfølgning
      </label>
      <input
        id="follow-up"
        type="datetime-local"
        name="followUpAt"
        defaultValue={existing}
        className="w-full rounded-lg border border-ink-200 bg-surface px-3.5 py-2.5 text-body"
      />
      <p className="text-small text-ink-500">Tomt felt fjerner opfølgningen.</p>
      <SubmitButton idle="Gem opfølgning" busy="Gemmer …" />
      {state?.error ? <Alert tone="danger">{state.error}</Alert> : null}
    </form>
  );
}

export function MeetingForm({ leadId }: { leadId: string }) {
  const [state, action] = useActionState<ActionResult | null, FormData>(
    bookMeeting,
    null,
  );

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="leadId" value={leadId} />
      <label htmlFor="meeting-start" className="block text-small font-semibold text-ink-800">
        Book møde
      </label>
      <input
        id="meeting-start"
        type="datetime-local"
        name="startsAt"
        required
        className="w-full rounded-lg border border-ink-200 bg-surface px-3.5 py-2.5 text-body"
      />
      <div className="grid grid-cols-2 gap-2">
        <select
          name="type"
          aria-label="Mødeform"
          defaultValue="phone"
          className="rounded-lg border border-ink-200 bg-surface px-3 py-2.5 text-body"
        >
          <option value="phone">Telefonmøde</option>
          <option value="video">Videomøde</option>
          <option value="physical">Fysisk møde</option>
        </select>
        <select
          name="durationMinutes"
          aria-label="Varighed"
          defaultValue="30"
          className="rounded-lg border border-ink-200 bg-surface px-3 py-2.5 text-body"
        >
          <option value="15">15 min</option>
          <option value="30">30 min</option>
          <option value="45">45 min</option>
          <option value="60">60 min</option>
        </select>
      </div>
      <SubmitButton idle="Opret møde" busy="Opretter …" />
      {state?.error ? <Alert tone="danger">{state.error}</Alert> : null}
    </form>
  );
}
