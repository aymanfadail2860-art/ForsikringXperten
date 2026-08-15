"use client";

import { useId } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Form primitives.
 *
 * Every field wires up label → input → error/hint through real ids and
 * aria-describedby, so validation errors are announced instead of just
 * turning something red.
 */

const controlBase =
  "w-full rounded-lg border bg-surface px-3.5 py-2.5 text-body text-ink-900 " +
  "placeholder:text-ink-400 transition-colors duration-150 " +
  "disabled:bg-ink-50 disabled:text-ink-400";

const controlState = (invalid?: boolean) =>
  invalid
    ? "border-danger-500 focus-visible:outline-danger-500"
    : "border-ink-200 hover:border-ink-300";

function FieldShell({
  label,
  hint,
  error,
  required,
  controlId,
  hintId,
  errorId,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  controlId: string;
  hintId: string;
  errorId: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={controlId} className="block text-small font-semibold text-ink-800">
        {label}
        {!required ? (
          <span className="ml-1.5 font-normal text-ink-400">(valgfrit)</span>
        ) : null}
      </label>
      {hint ? (
        <p id={hintId} className="mt-1 text-small text-ink-500">
          {hint}
        </p>
      ) : null}
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={errorId} className="mt-1.5 text-small font-medium text-danger-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type BaseFieldProps = {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  /** Applied to the control itself, not the wrapper. */
  className?: string;
};

export function TextField({
  label,
  hint,
  error,
  required,
  className,
  ...props
}: BaseFieldProps & Omit<ComponentPropsWithoutRef<"input">, "className">) {
  const id = useId();
  const controlId = props.id ?? `f-${id}`;
  const hintId = `${controlId}-hint`;
  const errorId = `${controlId}-error`;

  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      required={required}
      controlId={controlId}
      hintId={hintId}
      errorId={errorId}
    >
      <input
        {...props}
        id={controlId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") ||
          undefined
        }
        className={cn(controlBase, controlState(Boolean(error)), className)}
      />
    </FieldShell>
  );
}

export function SelectField({
  label,
  hint,
  error,
  required,
  options,
  placeholder,
  className,
  ...props
}: BaseFieldProps & {
  options: { value: string; label: string }[];
  placeholder?: string;
} & Omit<ComponentPropsWithoutRef<"select">, "className" | "children">) {
  const id = useId();
  const controlId = props.id ?? `f-${id}`;
  const hintId = `${controlId}-hint`;
  const errorId = `${controlId}-error`;

  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      required={required}
      controlId={controlId}
      hintId={hintId}
      errorId={errorId}
    >
      <select
        {...props}
        id={controlId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") ||
          undefined
        }
        className={cn(controlBase, controlState(Boolean(error)), "pr-10", className)}
      >
        {placeholder ? (
          <option value="">{placeholder}</option>
        ) : null}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function TextAreaField({
  label,
  hint,
  error,
  required,
  className,
  ...props
}: BaseFieldProps & Omit<ComponentPropsWithoutRef<"textarea">, "className">) {
  const id = useId();
  const controlId = props.id ?? `f-${id}`;
  const hintId = `${controlId}-hint`;
  const errorId = `${controlId}-error`;

  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      required={required}
      controlId={controlId}
      hintId={hintId}
      errorId={errorId}
    >
      <textarea
        {...props}
        id={controlId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") ||
          undefined
        }
        className={cn(controlBase, controlState(Boolean(error)), "min-h-28", className)}
      />
    </FieldShell>
  );
}

/**
 * Large tappable option used throughout the funnel. Renders a real
 * checkbox/radio so keyboard and screen-reader behaviour is native.
 */
export function OptionCard({
  type,
  name,
  value,
  checked,
  onChange,
  title,
  description,
}: {
  type: "checkbox" | "radio";
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string, checked: boolean) => void;
  title: string;
  description?: string;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors duration-150",
        "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent-600",
        checked
          ? "border-accent-500 bg-accent-50"
          : "border-ink-200 bg-surface hover:border-ink-300 hover:bg-ink-50",
      )}
    >
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(value, e.target.checked)}
        className={cn(
          "mt-0.5 size-5 shrink-0 border-ink-300 text-accent-600 accent-accent-600",
          type === "radio" ? "rounded-full" : "rounded",
        )}
      />
      <span className="min-w-0">
        <span className="block text-body font-semibold text-ink-900">{title}</span>
        {description ? (
          <span className="mt-0.5 block text-small text-ink-600">{description}</span>
        ) : null}
      </span>
    </label>
  );
}

/** Consent checkbox — never pre-checked, never bundled with other consents. */
export function ConsentCheckbox({
  name,
  checked,
  onChange,
  error,
  children,
}: {
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  children: ReactNode;
}) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3">
        <input
          id={id}
          type="checkbox"
          name={name}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="mt-0.5 size-5 shrink-0 rounded border-ink-300 accent-accent-600"
        />
        <span className="text-small text-ink-600">{children}</span>
      </label>
      {error ? (
        <p id={errorId} className="mt-1.5 text-small font-medium text-danger-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
