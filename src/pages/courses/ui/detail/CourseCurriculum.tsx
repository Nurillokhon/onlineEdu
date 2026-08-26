import { useId, useState } from 'react'
import { lessonCount, type Course } from '@/entities/course'
import { ChevronDownIcon } from '@/shared/ui'

/** Two-digit module number, so 01 and 10 stay the same width. */
function moduleNumber(index: number) {
  return String(index + 1).padStart(2, '0')
}

/** The "O'quv dasturi" panel: modules that expand to reveal their lessons. */
export function CourseCurriculum({ course }: { course: Course }) {
  const baseId = useId()
  // The first module opens by default, so the panel never lands fully closed.
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-2xl font-bold text-ink">O'quv dasturi tuzilmasi</h2>
        <p className="text-sm text-ink-muted">
          {course.curriculum.length} modul • {lessonCount(course)} ta dars • {course.hours} soat
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {course.curriculum.map((module, index) => {
          const open = openIndex === index
          const panelId = `${baseId}-module-${index}`

          return (
            <li key={module.title} className="overflow-hidden rounded-2xl border border-line bg-card">
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : index)}
                aria-expanded={open}
                aria-controls={panelId}
                className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-brand-softer"
              >
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-xl font-semibold transition-colors ${
                    open ? 'bg-brand text-on-brand' : 'bg-brand-softer text-brand'
                  }`}
                >
                  {moduleNumber(index)}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-ink">{module.title}</span>
                  <span className="block text-sm text-ink-muted">
                    {module.lessons.length} ta dars • {module.duration}
                  </span>
                </span>

                <span
                  className={`shrink-0 text-ink-muted transition-transform motion-reduce:transition-none ${
                    open ? 'rotate-180' : ''
                  }`}
                >
                  <ChevronDownIcon size={20} />
                </span>
              </button>

              <div id={panelId} hidden={!open} className="border-t border-line px-4 py-3">
                <ol className="flex flex-col gap-2">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <li key={lesson.id} className="flex items-center gap-3 text-sm text-ink-muted">
                      <span className="w-6 shrink-0 tabular-nums text-right text-xs">
                        {lessonIndex + 1}.
                      </span>
                      {lesson.title}
                    </li>
                  ))}
                </ol>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
