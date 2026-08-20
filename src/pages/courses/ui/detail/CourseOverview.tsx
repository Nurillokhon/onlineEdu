import type { Course } from '@/entities/course'
import { CheckCircleIcon } from '@/shared/ui'

/** The "Kurs haqida" panel: what the course covers and what it leaves you with. */
export function CourseOverview({ course }: { course: Course }) {
  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4">
        <h2 className="font-display text-2xl font-bold text-ink">Tavsif</h2>
        {course.description.map((paragraph) => (
          <p key={paragraph} className="max-w-prose leading-relaxed text-ink-muted">
            {paragraph}
          </p>
        ))}
      </section>

      {/* A card, not a tinted panel: the shell already paints the page
          brand-softer, so a tinted panel would vanish into it. */}
      <section className="rounded-2xl border border-line bg-card p-5 sm:p-6">
        <h3 className="font-display text-lg font-bold text-ink">Siz nimalarni o'rganasiz:</h3>
        <ul className="mt-4 grid gap-3 medium:grid-cols-2">
          {course.outcomes.map((outcome) => (
            <li key={outcome} className="flex items-start gap-2.5 text-sm text-ink">
              <span className="mt-0.5 shrink-0 text-brand">
                <CheckCircleIcon size={18} />
              </span>
              {outcome}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
