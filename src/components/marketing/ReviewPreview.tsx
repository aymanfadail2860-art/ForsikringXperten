/**
 * Hero visual.
 *
 * Deliberately not a fake analytics dashboard. It shows the four steps of a
 * forsikringstjek so the visitor understands what happens after they click —
 * the value of the visual is explanation, not decoration.
 */

const steps = [
  {
    title: "Din situation",
    body: "Bolig, bil, familie — eller virksomhedens aktiviteter og ansatte.",
  },
  {
    title: "Dine nuværende forsikringer",
    body: "Hvad har du i dag, og hvor er dækningen sat?",
  },
  {
    title: "Gennemgang",
    body: "Vi ser på dækning, selvrisiko, dobbeltdækning og huller.",
  },
  {
    title: "Anbefaling",
    body: "Du får et konkret overblik. Hvad du gør, bestemmer du selv.",
  },
];

export function ReviewPreview() {
  return (
    <div className="rounded-2xl border border-white/12 bg-white/[0.06] p-2 shadow-lg backdrop-blur-sm">
      <div className="rounded-xl bg-surface p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <p className="text-caption font-semibold uppercase tracking-[0.12em] text-ink-400">
            Dit forsikringstjek
          </p>
          <span className="rounded-md bg-accent-50 px-2 py-0.5 text-caption font-semibold text-accent-700">
            4 trin
          </span>
        </div>

        <ol className="mt-5 space-y-0">
          {steps.map((step, i) => (
            <li key={step.title} className="relative flex gap-4 pb-5 last:pb-0">
              {i < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute left-[0.9375rem] top-8 h-[calc(100%-1.5rem)] w-px bg-ink-100"
                />
              ) : null}
              <span
                aria-hidden="true"
                className={`relative z-10 grid size-8 shrink-0 place-items-center rounded-full text-caption font-bold ${
                  i === 0
                    ? "bg-accent-600 text-white"
                    : "border border-ink-200 bg-surface text-ink-400"
                }`}
              >
                {i + 1}
              </span>
              <div className="min-w-0 pt-1">
                <p className="text-small font-semibold text-ink-900">{step.title}</p>
                <p className="mt-0.5 text-small text-ink-500">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-5 rounded-lg bg-ink-50 px-4 py-3">
          <p className="text-small text-ink-600">
            Du starter med ét spørgsmål: skal vi kigge på{" "}
            <span className="font-semibold text-ink-900">dine private</span> eller{" "}
            <span className="font-semibold text-ink-900">virksomhedens</span> forsikringer?
          </p>
        </div>
      </div>
    </div>
  );
}
