"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import {
  ConsentCheckbox,
  OptionCard,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/ui/Field";
import { FunnelProgress } from "./FunnelProgress";
import { FunnelSuccess } from "./FunnelSuccess";
import {
  initialFunnelState,
  stepsFor,
  toLeadPayload,
  validateComplete,
  type FunnelState,
} from "./funnelState";
import {
  privateFunnelOptions,
  businessFunnelOptions,
} from "@/content/products";
import { industryFunnelOptions } from "@/content/industries";
import {
  contactMethodLabels,
  employeeRangeLabels,
  goalLabels,
  type ContactMethod,
  type EmployeeRange,
  type LeadType,
  type PrimaryGoal,
} from "@/lib/validation/lead";
import { getAttribution } from "@/lib/attribution/attribution";
import { trackEvent } from "@/lib/analytics/track";
import { LEAD_CONSENT_SHORT } from "./consentText";

const DRAFT_KEY = "fx_funnel_draft";
const SESSION_KEY = "fx_funnel_session";

/**
 * The forsikringstjek.
 *
 * Design decisions that matter for conversion:
 *  - one question per screen, so the flow never looks like a form
 *  - the lead type can be pre-selected from the URL, removing a whole step
 *    for visitors arriving from a segment-specific CTA
 *  - answers are kept in sessionStorage, so a refresh or a back button does
 *    not throw the visitor back to the start
 *  - a failed submit never clears the form
 *  - progression is reported anonymously so drop-off is measurable per step
 */
export function LeadFunnel({ initialType }: { initialType?: LeadType }) {
  const [state, setState] = useState<FunnelState>(() => ({
    ...initialFunnelState,
    leadType: initialType,
  }));
  const [stepIndex, setStepIndex] = useState(initialType ? 1 : 0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);

  const sessionId = useRef<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const startedRef = useRef(false);
  const viewedSteps = useRef<Set<string>>(new Set());

  const steps = useMemo(() => stepsFor(state.leadType), [state.leadType]);
  const step = steps[Math.min(stepIndex, steps.length - 1)];
  const isLastStep = stepIndex === steps.length - 1;

  // --- Session id + draft restore ----------------------------------------
  useEffect(() => {
    try {
      let id = window.sessionStorage.getItem(SESSION_KEY);
      if (!id) {
        id = crypto.randomUUID();
        window.sessionStorage.setItem(SESSION_KEY, id);
      }
      sessionId.current = id;

      const draft = window.sessionStorage.getItem(DRAFT_KEY);
      if (draft) {
        const parsed = JSON.parse(draft) as { state: FunnelState; stepIndex: number };
        if (parsed?.state) {
          setState((prev) => ({
            ...parsed.state,
            // A type in the URL always wins over a stale draft.
            leadType: initialType ?? parsed.state.leadType,
            consent: false, // consent is never restored — it must be given now
          }));
          setStepIndex(Math.max(0, Math.min(parsed.stepIndex ?? 0, 6)));
        }
      }
    } catch {
      /* storage unavailable — the funnel still works, just without a draft */
    }
    setRestored(true);
  }, [initialType]);

  // --- Persist draft ------------------------------------------------------
  useEffect(() => {
    if (!restored || status === "done") return;
    try {
      window.sessionStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ state: { ...state, consent: false }, stepIndex }),
      );
    } catch {
      /* ignore */
    }
  }, [state, stepIndex, restored, status]);

  const postFunnelEvent = useCallback(
    (eventType: string, extra: { stepId?: string; stepIndex?: number } = {}) => {
      if (!sessionId.current) return;
      const body = JSON.stringify({
        sessionId: sessionId.current,
        eventType,
        leadType: state.leadType,
        landingPage: getAttribution().landing_page,
        ...extra,
      });
      // keepalive so the event survives the user navigating away mid-step.
      void fetch("/api/funnel-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {
        /* tracking must never break the funnel */
      });
    },
    [state.leadType],
  );

  // --- Step view tracking -------------------------------------------------
  useEffect(() => {
    if (!restored || status === "done" || !step) return;

    if (!startedRef.current) {
      startedRef.current = true;
      trackEvent("lead_flow_started", { lead_type: state.leadType });
      postFunnelEvent("lead_flow_started");
    }

    const key = `${state.leadType ?? "unknown"}:${step.id}`;
    if (!viewedSteps.current.has(key)) {
      viewedSteps.current.add(key);
      trackEvent("lead_step_viewed", {
        step_id: step.id,
        step_index: stepIndex,
        lead_type: state.leadType,
      });
      postFunnelEvent("lead_step_viewed", { stepId: step.id, stepIndex });
    }
  }, [restored, status, step, stepIndex, state.leadType, postFunnelEvent]);

  const set = <K extends keyof FunnelState>(key: K, value: FunnelState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
    // Clear the error as soon as the user acts on it.
    setErrors((prev) => {
      if (!prev[key as string]) return prev;
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  };

  const toggleProduct = (value: string, checked: boolean) => {
    setState((prev) => ({
      ...prev,
      selectedProducts: checked
        ? [...prev.selectedProducts, value]
        : prev.selectedProducts.filter((v) => v !== value),
    }));
    setErrors((prev) => {
      if (!prev.selectedProducts) return prev;
      const next = { ...prev };
      delete next.selectedProducts;
      return next;
    });
  };

  const focusHeading = () => {
    // Move focus to the new question so screen readers and keyboard users
    // land in the right place after a step change.
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const goNext = async () => {
    if (!step) return;
    const stepErrors = step.validate(state);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    trackEvent("lead_step_completed", {
      step_id: step.id,
      step_index: stepIndex,
      lead_type: state.leadType,
    });
    postFunnelEvent("lead_step_completed", { stepId: step.id, stepIndex });

    if (!isLastStep) {
      setErrors({});
      setStepIndex((i) => i + 1);
      focusHeading();
      return;
    }

    await submit();
  };

  const goBack = () => {
    if (stepIndex === 0) return;
    setErrors({});
    setSubmitError(null);
    setStepIndex((i) => i - 1);
    focusHeading();
  };

  const submit = async () => {
    const finalErrors = validateComplete(state);
    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      setSubmitError("Der mangler noget længere oppe i flowet. Gå tilbage og tjek felterne.");
      return;
    }

    setStatus("submitting");
    setSubmitError(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          toLeadPayload(state, {
            sessionId: sessionId.current ?? undefined,
            attribution: getAttribution() as Record<string, string | undefined>,
          }),
        ),
      });

      const result = (await response.json().catch(() => null)) as
        | { ok: boolean; error?: string; fields?: Record<string, string> }
        | null;

      if (!response.ok || !result?.ok) {
        // The form keeps every answer — the user only fixes what is wrong.
        if (result?.fields) setErrors(result.fields);
        setSubmitError(result?.error ?? "Vi kunne ikke sende din henvendelse. Prøv igen.");
        setStatus("error");
        trackEvent("lead_submit_failed", {
          lead_type: state.leadType,
          http_status: response.status,
        });
        return;
      }

      trackEvent("lead_submitted", {
        lead_type: state.leadType,
        product_count: state.selectedProducts.length,
        primary_goal: state.primaryGoal,
        preferred_contact: state.preferredContact,
      });

      try {
        window.sessionStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
      setStatus("done");
      focusHeading();
    } catch {
      setSubmitError(
        "Vi kunne ikke få forbindelse. Tjek din internetforbindelse og prøv igen.",
      );
      setStatus("error");
      trackEvent("lead_submit_failed", { lead_type: state.leadType, reason: "network" });
    }
  };

  if (status === "done") {
    return (
      <FunnelSuccess
        preferredContact={state.preferredContact}
        firstName={state.firstName}
      />
    );
  }

  if (!restored || !step) {
    // Placeholder with the same height as a step, so nothing jumps.
    return <div className="min-h-[26rem] animate-pulse rounded-xl bg-ink-50" />;
  }

  const productOptions =
    state.leadType === "erhverv" ? businessFunnelOptions : privateFunnelOptions;

  return (
    <div>
      <FunnelProgress current={stepIndex + 1} total={steps.length} />

      <form
        className="mt-8"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void goNext();
        }}
      >
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="text-h2 outline-none"
          key={step.id}
        >
          {step.title}
        </h2>
        {step.description ? (
          <p className="mt-2 text-body text-ink-600">{step.description}</p>
        ) : null}

        <div className="mt-7 space-y-4">
          {step.id === "type" ? (
            <fieldset>
              <legend className="sr-only">Vælg type</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <OptionCard
                  type="radio"
                  name="leadType"
                  value="privat"
                  checked={state.leadType === "privat"}
                  onChange={() => set("leadType", "privat")}
                  title="Mine private forsikringer"
                  description="Bil, bolig, indbo, ulykke og rejse"
                />
                <OptionCard
                  type="radio"
                  name="leadType"
                  value="erhverv"
                  checked={state.leadType === "erhverv"}
                  onChange={() => set("leadType", "erhverv")}
                  title="Min virksomheds forsikringer"
                  description="Ansvar, arbejdsskade, biler, bygninger og mere"
                />
              </div>
              {errors.leadType ? (
                <p className="mt-2 text-small font-medium text-danger-700">
                  {errors.leadType}
                </p>
              ) : null}
            </fieldset>
          ) : null}

          {step.id === "products" ? (
            <fieldset>
              <legend className="sr-only">Vælg forsikringsområder</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {productOptions.map((option) => (
                  <OptionCard
                    key={option.value}
                    type="checkbox"
                    name="selectedProducts"
                    value={option.value}
                    checked={state.selectedProducts.includes(option.value)}
                    onChange={toggleProduct}
                    title={option.label}
                  />
                ))}
              </div>
              {errors.selectedProducts ? (
                <p className="mt-2 text-small font-medium text-danger-700">
                  {errors.selectedProducts}
                </p>
              ) : null}
            </fieldset>
          ) : null}

          {step.id === "company" ? (
            <>
              <TextField
                label="Virksomhedens navn"
                name="companyName"
                required
                autoComplete="organization"
                value={state.companyName}
                onChange={(e) => set("companyName", e.target.value)}
                error={errors.companyName}
              />
              <TextField
                label="CVR-nummer"
                name="cvr"
                inputMode="numeric"
                placeholder="12345678"
                value={state.cvr}
                onChange={(e) => set("cvr", e.target.value)}
                error={errors.cvr}
                hint="Valgfrit — men det gør forberedelsen hurtigere."
              />
            </>
          ) : null}

          {step.id === "profile" ? (
            <>
              <SelectField
                label="Branche"
                name="industry"
                required
                placeholder="Vælg branche"
                options={industryFunnelOptions}
                value={state.industry}
                onChange={(e) => set("industry", e.target.value)}
                error={errors.industry}
              />
              <fieldset>
                <legend className="text-small font-semibold text-ink-800">
                  Antal ansatte
                </legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {(Object.keys(employeeRangeLabels) as EmployeeRange[]).map((range) => (
                    <OptionCard
                      key={range}
                      type="radio"
                      name="employeesRange"
                      value={range}
                      checked={state.employeesRange === range}
                      onChange={() => set("employeesRange", range)}
                      title={employeeRangeLabels[range]}
                    />
                  ))}
                </div>
                {errors.employeesRange ? (
                  <p className="mt-2 text-small font-medium text-danger-700">
                    {errors.employeesRange}
                  </p>
                ) : null}
              </fieldset>
            </>
          ) : null}

          {step.id === "goal" ? (
            <>
              <fieldset>
                <legend className="sr-only">Vælg formål</legend>
                <div className="grid gap-3">
                  {(Object.keys(goalLabels) as PrimaryGoal[]).map((goal) => (
                    <OptionCard
                      key={goal}
                      type="radio"
                      name="primaryGoal"
                      value={goal}
                      checked={state.primaryGoal === goal}
                      onChange={() => set("primaryGoal", goal)}
                      title={goalLabels[goal]}
                    />
                  ))}
                </div>
                {errors.primaryGoal ? (
                  <p className="mt-2 text-small font-medium text-danger-700">
                    {errors.primaryGoal}
                  </p>
                ) : null}
              </fieldset>

              <div className="pt-2">
                <TextField
                  label={
                    state.leadType === "erhverv"
                      ? "Hvilket selskab er I hos i dag?"
                      : "Hvilket selskab er du hos i dag?"
                  }
                  name="currentProvider"
                  value={state.currentProvider}
                  onChange={(e) => set("currentProvider", e.target.value)}
                  error={errors.currentProvider}
                  hint="Valgfrit. Det gør gennemgangen mere konkret."
                />
              </div>
            </>
          ) : null}

          {step.id === "contact" ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Fornavn"
                  name="firstName"
                  required
                  autoComplete="given-name"
                  value={state.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  error={errors.firstName}
                />
                <TextField
                  label="Efternavn"
                  name="lastName"
                  required
                  autoComplete="family-name"
                  value={state.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                  error={errors.lastName}
                />
              </div>
              <TextField
                label="Telefon"
                name="phone"
                type="tel"
                required
                inputMode="tel"
                autoComplete="tel"
                placeholder="12 34 56 78"
                value={state.phone}
                onChange={(e) => set("phone", e.target.value)}
                error={errors.phone}
              />
              <TextField
                label="E-mail"
                name="email"
                type="email"
                required
                inputMode="email"
                autoComplete="email"
                value={state.email}
                onChange={(e) => set("email", e.target.value)}
                error={errors.email}
              />

              {/* Honeypot: off-screen, not hidden, so bots still see it. */}
              <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={state.website}
                  onChange={(e) => set("website", e.target.value)}
                />
              </div>
            </>
          ) : null}

          {step.id === "preference" ? (
            <>
              <fieldset>
                <legend className="sr-only">Vælg kontaktform</legend>
                <div className="grid gap-3">
                  {(Object.keys(contactMethodLabels) as ContactMethod[]).map((method) => (
                    <OptionCard
                      key={method}
                      type="radio"
                      name="preferredContact"
                      value={method}
                      checked={state.preferredContact === method}
                      onChange={() => set("preferredContact", method)}
                      title={contactMethodLabels[method]}
                      description={
                        method === "book"
                          ? "Vi sender et forslag til et tidspunkt, der passer dig"
                          : undefined
                      }
                    />
                  ))}
                </div>
                {errors.preferredContact ? (
                  <p className="mt-2 text-small font-medium text-danger-700">
                    {errors.preferredContact}
                  </p>
                ) : null}
              </fieldset>

              <TextAreaField
                label="Er der noget, vi skal vide på forhånd?"
                name="comment"
                value={state.comment}
                onChange={(e) => set("comment", e.target.value)}
                error={errors.comment}
                hint="Valgfrit."
              />

              <div className="rounded-lg bg-ink-50 p-4">
                <ConsentCheckbox
                  name="consent"
                  checked={state.consent}
                  onChange={(checked) => set("consent", checked)}
                  error={errors.consent}
                >
                  {LEAD_CONSENT_SHORT}
                </ConsentCheckbox>
              </div>
            </>
          ) : null}
        </div>

        {submitError ? (
          <div className="mt-6">
            <Alert tone="danger" title="Det gik ikke igennem">
              {submitError}
            </Alert>
          </div>
        ) : null}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          {stepIndex > 0 ? (
            <Button variant="ghost" onClick={goBack} disabled={status === "submitting"}>
              ← Tilbage
            </Button>
          ) : (
            <span />
          )}

          <Button
            type="submit"
            size="lg"
            disabled={status === "submitting"}
            className="sm:min-w-56"
          >
            {status === "submitting"
              ? "Sender …"
              : isLastStep
                ? "Send mit forsikringstjek"
                : "Fortsæt"}
          </Button>
        </div>
      </form>
    </div>
  );
}
