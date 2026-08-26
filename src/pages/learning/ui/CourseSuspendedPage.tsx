import { Link, Navigate, useParams } from 'react-router-dom'
import { courses } from '@/entities/course'
import { EXAM_ATTEMPTS, useEnrollmentQuery } from '@/entities/enrollment'
import { lessonPath, paths } from '@/shared/config/routes'
import { AlertIcon, BellIcon, HomeIcon, InfoIcon, Spinner } from '@/shared/ui'

/**
 * Where a course ends after the exam attempts run out. The finished lessons
 * stay reachable: the learner paid for them and passed them, and taking them
 * away is punishment rather than policy.
 */
export function CourseSuspendedPage() {
  const { courseId = '' } = useParams()
  const course = courses.find((item) => item.id === courseId)
  const { data: enrollment, isLoading } = useEnrollmentQuery(courseId)

  if (!course) return <Navigate to={paths.learning} replace />
  if (isLoading) return <Spinner label="Yuklanmoqda…" />
  if (enrollment && enrollment.status !== 'suspended') {
    return <Navigate to={paths.learning} replace />
  }

  const lastCompleted = enrollment?.lessons.filter((state) => state.status === 'completed').at(-1)

  return (
    <div className="mx-auto max-w-2xl py-6">
      <section className="overflow-hidden rounded-2xl border border-line bg-card">
        <div className="h-1.5 bg-danger" aria-hidden="true" />

        <div className="flex flex-col items-center gap-5 px-6 py-10 text-center">
          <span className="grid size-16 place-items-center rounded-2xl bg-danger-soft text-danger">
            <AlertIcon size={30} />
          </span>

          <div className="flex flex-col gap-2">
            <h1 className="font-display text-3xl font-bold text-ink">
              Kurs vaqtincha to'xtatildi
            </h1>
            <p className="text-lg font-medium text-danger">
              Siz ushbu modul testidan {EXAM_ATTEMPTS} marta yiqildingiz
            </p>
          </div>

          <p className="flex items-start gap-3 rounded-xl bg-info-soft px-4 py-3.5 text-left text-sm text-ink">
            <span className="mt-0.5 shrink-0 text-ink-muted">
              <InfoIcon size={18} />
            </span>
            <span>
              Texnik topshiriqqa ko'ra, siz keyingi o'quv sessiyasiga o'tkazildingiz. Arizangiz
              qayta ko'rilmaydi, kursni yangi sessiyada boshlashingiz mumkin (qo'shimcha to'lovsiz).
            </span>
          </p>

          <p className="flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink-muted">
            <BellIcon size={16} />
            SMS va Email orqali batafsil ma'lumot yuboriladi
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to={paths.learning}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-on-brand transition-colors hover:bg-brand-hover"
            >
              <HomeIcon size={16} />
              Bosh sahifaga qaytish
            </Link>

            {lastCompleted ? (
              <Link
                to={lessonPath(courseId, lastCompleted.lessonId)}
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-brand-softer"
              >
                Tugallangan darslarni ko'rish
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  )
}
