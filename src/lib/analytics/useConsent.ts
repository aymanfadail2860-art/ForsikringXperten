"use client";

import { useSyncExternalStore } from "react";
import { readConsent, type ConsentState } from "./consent";

/**
 * Consent as an external store.
 *
 * The stored decision lives in localStorage and changes through custom events,
 * which is exactly what `useSyncExternalStore` is for. Reading it this way
 * avoids the "set state in an effect after mount" pattern, and gives every
 * consumer the same value in the same render.
 *
 * The snapshot is cached so the returned object identity is stable between
 * renders — `useSyncExternalStore` re-renders forever otherwise.
 */

let cached: ConsentState | null = null;
let hasRead = false;
/** True while the user has reopened the banner to change an existing choice. */
let reopened = false;

function invalidate() {
  hasRead = false;
  cached = null;
}

function subscribe(onStoreChange: () => void) {
  const onConsent = () => {
    invalidate();
    reopened = false;
    onStoreChange();
  };
  const onReopen = () => {
    reopened = true;
    onStoreChange();
  };

  window.addEventListener("fx:consent", onConsent);
  window.addEventListener("fx:consent-reopen", onReopen);
  // Another tab may have made the choice.
  window.addEventListener("storage", onConsent);

  return () => {
    window.removeEventListener("fx:consent", onConsent);
    window.removeEventListener("fx:consent-reopen", onReopen);
    window.removeEventListener("storage", onConsent);
  };
}

function getSnapshot(): ConsentState | null {
  if (!hasRead) {
    cached = readConsent();
    hasRead = true;
  }
  return cached;
}

/** The server never has access to the visitor's choice. */
function getServerSnapshot(): ConsentState | null {
  return null;
}

/** The stored consent decision, or null if none has been made. */
export function useConsent(): ConsentState | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function getPromptSnapshot(): boolean {
  return reopened || getSnapshot() === null;
}

/**
 * Whether the consent dialog should be shown — either no decision has been
 * made, or the user asked to change it.
 *
 * False during SSR and the first client render, so the banner never flashes
 * for someone who already decided.
 */
export function useConsentPromptOpen(): boolean {
  return useSyncExternalStore(subscribe, getPromptSnapshot, () => false);
}

/**
 * True once the component has hydrated on the client. Lets a component defer
 * reading browser-only storage to its first client render instead of patching
 * state in from an effect.
 */
const noopSubscribe = () => () => {};
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
