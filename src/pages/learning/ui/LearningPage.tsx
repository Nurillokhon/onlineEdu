import { Link } from 'react-router-dom'
import { courses } from '@/entities/course'
import { paths } from '@/shared/config/routes'
import { ClockIcon, PlayIcon } from '@/shared/ui'

/** Feed of the courses the learner has actually started. */
export function LearningPage() {
  const started = courses.filter((course) => course.progress > 0)
  const notStarted = courses.filter((course) => course.progress === 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold text-ink">Mening o'qishim</h1>
        <p className="text-ink-muted text-sm">
          {started.length} ta kurs davom etmoqda, {notStarted.length} tasi hali boshlanmagan.
        </p>
      </div>

      <div className="grid medium:grid-cols-2 large:grid-cols-3 gap-4">
        {started.map((course) => (
          <article
            key={course.id}
            className="rounded-2xl bg-card border border-line p-5 flex flex-col gap-4"
          >
            <div>
              <p className="font-medium text-ink">{course.title}</p>
              <p className="text-ink-muted text-sm">{course.mentor.name}</p>
            </div>

            <div className="flex flex-col gap-2 mt-auto">
              <div className="flex items-center justify-between text-sm text-ink-muted">
                <span className="flex items-center gap-1">
                  <ClockIcon size={14} />
                  {course.hours} soat
                </span>
                <span>{course.progress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-line overflow-hidden">
                <span
                  className="block h-full rounded-full bg-brand"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>

            <Link
              to={paths.courses}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand text-on-brand text-sm font-medium py-2.5 hover:bg-brand-hover transition-colors"
            >
              <PlayIcon size={14} />
              Davom etish
            </Link>
          </article>
        ))}
      </div>

      {notStarted.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-lg font-semibold text-ink">Boshlanmagan kurslar</h2>
          <div className="flex flex-col gap-2">
            {notStarted.map((course) => (
              <div
                key={course.id}
                className="rounded-xl bg-card border border-line px-5 py-4 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-ink">{course.title}</p>
                  <p className="text-ink-muted text-sm">{course.mentor.name}</p>
                </div>
                <Link
                  to={paths.courses}
                  className="text-sm text-brand-hover hover:underline shrink-0"
                >
                  Boshlash
                </Link>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
