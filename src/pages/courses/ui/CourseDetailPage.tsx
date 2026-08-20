import { Link, useParams } from 'react-router-dom'
import { courses } from '@/entities/course'
import { paths } from '@/shared/config/routes'
import { ArrowLeftIcon, ClockIcon, PlayIcon, UsersIcon } from '@/shared/ui'

function ProgressBar({ value }: { value: number }) {
  return (
    <div
      className="h-1.5 rounded-full bg-line overflow-hidden"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
    >
      <span className="block h-full rounded-full bg-brand" style={{ width: `${value}%` }} />
    </div>
  )
}

const backLink = (
  <Link
    to={paths.courses}
    className="self-start inline-flex items-center gap-2 text-sm text-brand-hover"
  >
    <ArrowLeftIcon size={16} />
    Barcha kurslarga qaytish
  </Link>
)

export function CourseDetailPage() {
  const { courseId } = useParams()
  const course = courses.find((item) => item.id === courseId)

  if (!course) {
    return (
      <div className="flex flex-col gap-4">
        {backLink}
        <h1 className="font-display text-2xl font-bold text-ink">Kurs topilmadi</h1>
        <p className="text-ink-muted">
          Bu kurs olib tashlangan bo'lishi mumkin. Katalogdan boshqasini tanlang.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {backLink}

      <div className="grid gap-6 expanded:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div className="aspect-16/10 overflow-hidden rounded-2xl border border-line bg-brand-softer">
          <img src={course.cover} alt="" className="h-full w-full object-cover" />
        </div>

        <section className="flex flex-col gap-5 rounded-2xl border border-line bg-card p-5 sm:p-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              {course.category}
            </p>
            <h1 className="font-display text-2xl font-bold text-ink">{course.title}</h1>
            <p className="text-sm text-ink-muted">{course.mentor}</p>
          </div>

          <p className="text-ink-muted">{course.summary}</p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-muted">
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon size={15} />
              {course.hours} soat
            </span>
            <span className="inline-flex items-center gap-1.5">
              <UsersIcon size={15} />
              {course.students.toLocaleString('en-US')} o'quvchi
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-muted">Kurs o'zlashtirildi</span>
              <span className="font-medium text-ink">{course.progress}%</span>
            </div>
            <ProgressBar value={course.progress} />
          </div>

          <div className="flex flex-wrap gap-2">
            {course.topics.map((topic) => (
              <span
                key={topic}
                className="rounded-full bg-brand-soft px-3 py-1.5 text-sm text-brand"
              >
                {topic}
              </span>
            ))}
          </div>

          <dl className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-brand-softer px-4 py-3">
              <dt className="text-sm text-ink-muted">Darslar</dt>
              <dd className="text-xl font-semibold text-ink">{course.lessons}</dd>
            </div>
            <div className="rounded-xl bg-brand-softer px-4 py-3">
              <dt className="text-sm text-ink-muted">Soatlar</dt>
              <dd className="text-xl font-semibold text-ink">{course.hours}</dd>
            </div>
          </dl>

          <button
            type="button"
            className="mt-2 inline-flex items-center gap-2 self-start rounded-xl bg-brand px-5 py-3 font-medium text-on-brand transition-colors hover:bg-brand-hover"
          >
            <PlayIcon size={16} />
            {course.progress > 0 ? 'Davom etish' : 'Kursni boshlash'}
          </button>
        </section>
      </div>
    </div>
  )
}
