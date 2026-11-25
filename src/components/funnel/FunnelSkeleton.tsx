/**
 * The shape of a funnel step, with no content in it.
 *
 * Used in three places that the visitor experiences as one continuous moment:
 *   1. `loading.tsx` — rendered the instant the route starts loading
 *   2. `LeadFunnel` before hydration — the client-only state is not ready yet
 *   3. nowhere else
 *
 * They must stay visually identical. If the loading shell and the hydration
 * placeholder look different, a single navigation reads as two page loads.
 *
 * A generic pulsing grey block would do the same job technically, but it tells
 * the visitor "something is loading" rather than "your step is arriving" —
 * and it changes size when the real content lands, which moves the page.
 */
export function FunnelSkeleton({ options = 2 }: { options?: number }) {
  return (
    <div aria-hidden="true" className="animate-pulse">
      <div className="flex items-baseline justify-between">
        <div className="h-4 w-24 rounded bg-ink-100" />
        <div className="h-4 w-10 rounded bg-ink-100" />
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-100">
        <div className="h-full w-1/5 rounded-full bg-ink-200" />
      </div>

      <div className="mt-8 h-7 w-3/4 rounded bg-ink-100" />
      <div className="mt-2.5 h-7 w-1/2 rounded bg-ink-100" />

      <div className="mt-7 space-y-3">
        {Array.from({ length: options }).map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-lg border border-ink-100 p-4"
          >
            <div className="mt-0.5 size-5 shrink-0 rounded-full bg-ink-100" />
            <div className="min-w-0 flex-1">
              <div className="h-4 w-2/5 rounded bg-ink-100" />
              <div className="mt-2 h-3 w-3/5 rounded bg-ink-50" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <div className="h-12 w-44 rounded-lg bg-ink-100" />
      </div>
    </div>
  );
}
