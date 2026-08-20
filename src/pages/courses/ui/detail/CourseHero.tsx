import type { ReactNode } from 'react'
import { lessonCount, useSavedCourses, type Course } from '@/entities/course'
import {
  BookmarkFilledIcon,
  BookmarkIcon,
  CheckBadgeIcon,
  ClockIcon,
  ModulesIcon,
  PlayIcon,
  UsersIcon,
} from '@/shared/ui'
import { CourseVideo } from './CourseVideo'

function Fact({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-ink-muted">
      {icon}
      {children}
    </span>
  )
}

interface CourseHeroProps {
  course: Course
  /** Opens the application form further down the page. */
  onApply: () => void
}

/** Enrolment header: what the course is, what it costs in time, and how to join. */
export function CourseHero({ course, onApply }: CourseHeroProps) {
  const { isSaved, toggle } = useSavedCourses()
  const saved = isSaved(course.id)

  return (
    <section className="rounded-2xl border border-line bg-card p-5 sm:p-6 expanded:p-8">
      <div className="grid gap-6 expanded:grid-cols-[minmax(0,1fr)_minmax(0,400px)] expanded:items-start">
        <div className="flex flex-col gap-4">
          <span className="self-start rounded-lg bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand">
            {course.level}
          </span>

          <h1 className="font-display text-3xl font-bold leading-tight text-ink expanded:text-4xl">
            {course.title}
          </h1>

          <p className="max-w-prose text-ink-muted">{course.summary}</p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-4">
            <Fact icon={<ClockIcon size={16} />}>{course.hours} soat</Fact>
            <Fact icon={<ModulesIcon size={16} />}>{course.curriculum.length} modul</Fact>
            <Fact icon={<UsersIcon size={16} />}>
              {course.students.toLocaleString('en-US')} talaba
            </Fact>
            {course.certificate ? (
              <span className="inline-flex items-center gap-2 text-sm text-brand">
                <CheckBadgeIcon size={16} />
                Sertifikat beriladi
              </span>
            ) : null}
          </div>

          <p className="sr-only">Kursda jami {lessonCount(course)} ta dars bor.</p>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onApply}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 font-medium text-on-brand transition-colors hover:bg-brand-hover"
            >
              <PlayIcon size={16} />
              Ariza topshirish
            </button>

            <button
              type="button"
              onClick={() => toggle(course.id)}
              aria-pressed={saved}
              className={`inline-flex items-center gap-2 rounded-xl border px-6 py-3 font-medium transition-colors ${
                saved
                  ? 'border-brand bg-brand-soft text-brand'
                  : 'border-line text-ink hover:border-brand-hover'
              }`}
            >
              {saved ? <BookmarkFilledIcon size={16} /> : <BookmarkIcon size={16} />}
              {saved ? 'Saqlangan' : 'Saqlash'}
            </button>
          </div>
        </div>

        <CourseVideo src={course.videoUrl} poster={course.cover} title={course.title} />
      </div>
    </section>
  )
}
