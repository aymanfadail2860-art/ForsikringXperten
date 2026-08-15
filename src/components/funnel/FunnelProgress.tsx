export function FunnelProgress({
  current,
  total,
}: {
  /** 1-based index of the step being shown. */
  current: number;
  total: number;
}) {
  const percent = Math.round((current / total) * 100);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-small font-semibold text-ink-700">
          Trin {current} af {total}
        </p>
        <p className="text-small text-ink-500">{percent}%</p>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-label="Fremdrift i forsikringstjekket"
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-100"
      >
        <div
          className="h-full rounded-full bg-accent-600 transition-[width] duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
