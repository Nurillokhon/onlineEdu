import { Link } from 'react-router-dom'
import { useAuth, useProfileStatsQuery } from '@/entities/user'
import { courses } from '@/entities/course'
import { useCourseProgressMap } from '@/entities/enrollment'
import { paths } from '@/shared/config/routes'
import { ClockIcon, PlayIcon } from '@/shared/ui'
import { lessonPath } from '@/shared/config/routes'

/**
 * Material 3 feed canonical layout: a responsive grid of cards that reflows
 * from one column in compact windows to three once the window is large.
 */
export function DashboardPage() {
  const { user } = useAuth()
  const { data } = useProfileStatsQuery()
  const { progressOf, resumeLessonOf } = useCourseProgressMap()

  const inProgress = courses.filter((course) => progressOf(course).completed > 0)

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl bg-card border border-line p-5 sm:p-6 flex flex-col gap-2">
        <h2 className="font-display text-2xl font-bold text-ink">
          Xush kelibsiz{user ? `, ${user.name}` : ''}!
        </h2>
        <p className="text-ink-muted">
          Bugun {inProgress.length} ta kurs davom etmoqda. Qoldirgan joyingizdan davom eting.
        </p>
      </section>

      <section aria-label="Statistika" className="grid grid-cols-2 large:grid-cols-4 gap-4">
        {[
          { label: 'Tugatilgan kurslar', value: data?.coursesCompleted ?? '—' },
          { label: "O'rganilgan soatlar", value: data?.hoursLearned ?? '—' },
          { label: 'Kunlik seriya', value: data?.streakDays ?? '—' },
          { label: 'Faol kurslar', value: inProgress.length },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-card border border-line px-5 py-4">
            <p className="text-ink-muted text-sm">{stat.label}</p>
            <p className="text-ink text-2xl font-semibold mt-1">{stat.value}</p>
          </div>
        ))}
      </section>

      <section aria-label="Davom etayotgan kurslar" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-ink">Davom etayotgan kurslar</h3>
          <Link to={paths.courses} className="text-sm text-brand-hover hover:underline">
            Barchasi
          </Link>
        </div>

        <div className="grid medium:grid-cols-2 large:grid-cols-3 gap-4">
          {inProgress.map((course) => {
            const progress = progressOf(course)
            const resumeId = resumeLessonOf(course.id)
            return (
            <article
              key={course.id}
              className="rounded-2xl bg-card border border-line p-5 flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1">
                <p className="font-medium text-ink">{course.title}</p>
                <p className="text-ink-muted text-sm">{course.mentor.name}</p>
              </div>

              <div className="flex flex-col gap-2 mt-auto">
                <div className="flex items-center justify-between text-sm text-ink-muted">
                  <span className="flex items-center gap-1">
                    <ClockIcon size={14} />
                    {course.hours} soat
                  </span>
                  <span>{progress.percent}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-line overflow-hidden">
                  <span
                    className="block h-full rounded-full bg-brand"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
              </div>

              <Link
                to={resumeId ? lessonPath(course.id, resumeId) : paths.courses}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand text-on-brand text-sm font-medium py-2.5 hover:bg-brand-hover transition-colors"
              >
                <PlayIcon size={14} />
                Davom etish
              </Link>
            </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
