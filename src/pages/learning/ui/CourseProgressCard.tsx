import type { CourseProgress } from '@/entities/enrollment'

/** The "Kurs jarayoni" card above the outline. */
export function CourseProgressCard({ progress }: { progress: CourseProgress }) {
  return (
    <section
      aria-label="Kurs jarayoni"
      className="flex flex-col gap-3 rounded-2xl border border-line bg-card p-5"
    >
      <h2 className="font-display text-lg font-semibold text-ink">Kurs jarayoni</h2>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm text-ink-muted">
          {progress.total} dan {progress.completed} tasi yakunlandi
        </p>
        <p className="font-semibold text-ink">{progress.percent}%</p>
      </div>
      <div
        role="progressbar"
        aria-valuenow={progress.percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 overflow-hidden rounded-full bg-brand-soft"
      >
        <span
          className="block h-full rounded-full bg-brand-hover transition-[width] motion-reduce:transition-none"
          style={{ width: `${progress.percent}%` }}
        />
      </div>
    </section>
  )
}
