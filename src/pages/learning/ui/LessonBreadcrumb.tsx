import { Link } from 'react-router-dom'
import { paths } from '@/shared/config/routes'
import { ArrowLeftIcon } from '@/shared/ui'

/**
 * Which course the open lesson belongs to. The app rail says the learner is in
 * "O'qishim"; this says which course, which the lesson title alone does not.
 */
export function LessonBreadcrumb({ courseTitle }: { courseTitle: string }) {
  return (
    <div className="flex items-center gap-3">
      <Link
        to={paths.learning}
        className="inline-flex items-center gap-2 rounded-xl py-1 text-sm text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeftIcon size={18} />
        Mening o'qishim
      </Link>
      <span className="h-4 w-px shrink-0 bg-line" aria-hidden="true" />
      <p className="min-w-0 truncate font-medium text-ink">{courseTitle}</p>
    </div>
  )
}
