import { Container } from "@/components/ui/Layout";
import { FunnelSkeleton } from "@/components/funnel/FunnelSkeleton";

/**
 * Shown the moment navigation into the funnel begins.
 *
 * Measured before this existed: tapping a choice on the front page left the
 * screen completely unchanged for ~950ms on a throttled phone — no spinner, no
 * movement, nothing. That silence is where people tap a second time or go back.
 *
 * Next renders this instantly on navigation, so the step frame is on screen
 * while the server work happens.
 */
export default function ForsikringstjekLoading() {
  return (
    <div className="bg-canvas">
      <Container width="content" className="py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-14">
          <div>
            <p className="text-caption font-semibold uppercase tracking-[0.12em] text-accent-600">
              Forsikringstjek
            </p>
            <div aria-hidden="true" className="animate-pulse">
              <div className="mt-4 h-9 w-5/6 rounded bg-ink-100" />
              <div className="mt-3 h-9 w-2/3 rounded bg-ink-100" />
              <div className="mt-5 h-5 w-full max-w-xl rounded bg-ink-50" />
            </div>

            <div className="mt-9 rounded-xl border border-ink-100 bg-surface p-6 shadow-sm sm:p-8">
              <FunnelSkeleton />
            </div>
          </div>
          <div className="hidden lg:block" />
        </div>
      </Container>
      <span className="sr-only" role="status">
        Indlæser forsikringstjekket
      </span>
    </div>
  );
}
