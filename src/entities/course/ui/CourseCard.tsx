import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ClockIcon, UsersIcon } from '@/shared/ui'
import type { Course } from '../model/courses'

const numberFormat = new Intl.NumberFormat('en-US')

interface CourseCardProps {
  course: Course
  /** Where the card's action leads. */
  to: string
  /** Overrides the action label, e.g. "Davom etish" on the learning feed. */
  actionLabel?: string
  /** Slot between the meta row and the action — used for progress bars. */
  children?: ReactNode
  className?: string
}

/**
 * Catalogue tile for a single course. The action link is stretched over the
 * whole card, so the tile is clickable as one unit while still exposing a
 * single, correctly labelled target to keyboards and screen readers.
 */
export function CourseCard({
  course,
  to,
  actionLabel = 'Batafsil',
  children,
  className = '',
}: CourseCardProps) {
  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-card transition-shadow hover:shadow-md focus-within:shadow-md ${className}`}
    >
      <div className="aspect-16/10 overflow-hidden bg-brand-softer">
        <img
          src={course.cover}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
          {course.category}
        </p>

        {/* Two lines are reserved so the meta row and action stay aligned
            across a row of cards, whatever the title length. */}
        <h3 className="font-display text-lg font-bold leading-snug text-ink line-clamp-2 min-h-[2lh]">
          {course.title}
        </h3>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
          <span className="inline-flex items-center gap-1.5">
            <ClockIcon size={14} />
            {course.hours} soat
          </span>
          <span className="inline-flex items-center gap-1.5">
            <UsersIcon size={14} />
            {numberFormat.format(course.students)} o'quvchi
          </span>
        </div>

        {children}

        <Link
          to={to}
          className="mt-auto inline-flex items-center justify-center rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-ink transition-colors after:absolute after:inset-0 after:content-[''] group-hover:border-brand group-hover:bg-brand group-hover:text-on-brand"
        >
          {actionLabel}
          <span className="sr-only"> — {course.title}</span>
        </Link>
      </div>
    </article>
  )
}
