import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDuration, type Course } from '@/entities/course'
import { EXAM_QUESTION_LABEL } from '../lib/labels'
import { lockReason, type Enrollment } from '@/entities/enrollment'
import { lessonPath, quizPath } from '@/shared/config/routes'
import {
  CheckCircleIcon,
  ChevronDownIcon,
  DocumentFilledIcon,
  LockIcon,
  PlayIcon,
} from '@/shared/ui'

interface CourseOutlineProps {
  course: Course
  enrollment?: Enrollment
  /** The lesson currently open in the player, if any. */
  activeLessonId?: string
  /** The quiz currently open, if the learner is inside one. */
  activeQuizId?: string
}

/** The "Mundarija" panel: modules, their lessons, and the module exam. */
export function CourseOutline({
  course,
  enrollment,
  activeLessonId,
  activeQuizId,
}: CourseOutlineProps) {
  const activeModule = course.curriculum.findIndex(
    (module) =>
      module.lessons.some((lesson) => lesson.id === activeLessonId) ||
      module.examId === activeQuizId ||
      module.lessons.some((lesson) => lesson.quizId === activeQuizId),
  )
  const [openIndex, setOpenIndex] = useState<number | null>(activeModule === -1 ? 0 : activeModule)
  const [blocked, setBlocked] = useState<{ id: string; reason: string } | null>(null)

  return (
    <section aria-label="Mundarija" className="rounded-2xl border border-line bg-card">
      <h2 className="border-b border-line px-5 py-4 font-display text-lg font-semibold text-ink">
        Mundarija
      </h2>

      <ul className="flex flex-col">
        {course.curriculum.map((module, moduleIndex) => {
          const open = openIndex === moduleIndex
          const exam = enrollment?.exams[moduleIndex]
          const moduleLocked = module.lessons.every(
            (lesson) =>
              enrollment?.lessons.find((state) => state.lessonId === lesson.id)?.status === 'locked',
          )

          return (
            <li key={module.title} className="border-b border-line last:border-b-0">
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : moduleIndex)}
                aria-expanded={open}
                className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-brand-softer"
              >
                <span className="min-w-0 flex-1 font-medium text-ink">
                  {moduleIndex + 1}. {module.title}
                </span>
                {moduleLocked ? <LockIcon size={16} /> : null}
                <span
                  className={`shrink-0 text-ink-muted transition-transform motion-reduce:transition-none ${
                    open ? 'rotate-180' : ''
                  }`}
                >
                  <ChevronDownIcon size={18} />
                </span>
              </button>

              {open ? (
                <ol className="flex flex-col pb-2">
                  {module.lessons.map((lesson) => {
                    const state = enrollment?.lessons.find((item) => item.lessonId === lesson.id)
                    const status = state?.status ?? 'locked'
                    const active = lesson.id === activeLessonId
                    const reason = lockReason(course, enrollment, lesson.id)

                    const row = (
                      <span className="flex w-full items-start gap-3 px-5 py-2.5 text-left">
                        <span className="mt-0.5 shrink-0">
                          {status === 'completed' ? (
                            <span className="text-brand-hover">
                              <CheckCircleIcon size={18} />
                            </span>
                          ) : status === 'current' ? (
                            <span className="grid size-[18px] place-items-center rounded-full bg-brand text-on-brand">
                              <PlayIcon size={10} />
                            </span>
                          ) : (
                            <span className="text-ink-muted">
                              <LockIcon size={16} />
                            </span>
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span
                            className={`block text-sm ${
                              status === 'locked' ? 'text-ink-muted' : 'text-ink'
                            }`}
                          >
                            {lesson.number} {lesson.title}
                          </span>
                          <span className="block text-xs text-ink-muted">
                            {formatDuration(lesson.duration)}
                          </span>
                        </span>
                      </span>
                    )

                    return (
                      <li
                        key={lesson.id}
                        className={active ? 'border-l-2 border-brand bg-brand-softer' : ''}
                      >
                        {status === 'locked' ? (
                          <button
                            type="button"
                            onClick={() =>
                              setBlocked({
                                id: lesson.id,
                                reason: reason ?? 'Bu dars hali ochilmagan.',
                              })
                            }
                            className="w-full transition-colors hover:bg-brand-softer"
                          >
                            {row}
                          </button>
                        ) : (
                          <Link
                            to={lessonPath(course.id, lesson.id)}
                            className="block transition-colors hover:bg-brand-softer"
                          >
                            {row}
                          </Link>
                        )}

                        {blocked?.id === lesson.id ? (
                          <p className="px-5 pb-2 pl-14 text-xs text-danger">{blocked.reason}</p>
                        ) : null}
                      </li>
                    )
                  })}

                  <li className={module.examId === activeQuizId ? 'bg-brand-softer' : ''}>
                    {exam?.status === 'available' || exam?.status === 'passed' ? (
                      <Link
                        to={quizPath(course.id, module.examId)}
                        className="flex items-start gap-3 px-5 py-2.5 transition-colors hover:bg-brand-softer"
                      >
                        <span className="mt-0.5 shrink-0 text-brand-hover">
                          {exam.status === 'passed' ? (
                            <CheckCircleIcon size={18} />
                          ) : (
                            <DocumentFilledIcon size={18} />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm text-ink">
                            {moduleIndex + 1}-Modul oraliq nazorati
                          </span>
                          <span className="block text-xs text-ink-muted">
                            {EXAM_QUESTION_LABEL}
                            {exam.status === 'passed' ? ` • ${exam.bestScore}%` : ''}
                          </span>
                        </span>
                      </Link>
                    ) : (
                      <span className="flex items-start gap-3 px-5 py-2.5">
                        <span className="mt-0.5 shrink-0 text-ink-muted">
                          <LockIcon size={16} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm text-ink-muted">
                            {moduleIndex + 1}-Modul oraliq nazorati
                          </span>
                          <span className="block text-xs text-ink-muted">
                            {exam?.status === 'failed'
                              ? 'Urinishlar tugadi'
                              : 'Moduldagi barcha darslardan keyin ochiladi'}
                          </span>
                        </span>
                      </span>
                    )}
                  </li>
                </ol>
              ) : null}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
