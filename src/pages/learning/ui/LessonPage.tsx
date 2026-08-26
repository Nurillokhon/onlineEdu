import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { courses, findLesson } from '@/entities/course'
import {
  WATCHED_THRESHOLD,
  courseProgress,
  lessonStateOf,
  lockReason,
  useEnrollmentQuery,
  useSaveWatchedMutation,
} from '@/entities/enrollment'
import { courseSuspendedPath, lessonPath, paths, quizPath } from '@/shared/config/routes'
import {
  AlertIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  LockIcon,
  RefreshIcon,
  Spinner,
} from '@/shared/ui'
import { useSaveIndicator } from '../lib/useSaveIndicator'
import { CourseOutline } from './CourseOutline'
import { LessonBreadcrumb } from './LessonBreadcrumb'
import { CourseProgressCard } from './CourseProgressCard'
import { LessonPlayer } from './LessonPlayer'
import { LessonTranscript } from './LessonTranscript'

export function LessonPage() {
  const { courseId = '', lessonId = '' } = useParams()
  const course = courses.find((item) => item.id === courseId)
  const { data: enrollment, isLoading } = useEnrollmentQuery(courseId)
  const save = useSaveWatchedMutation()
  const saveStatus = useSaveIndicator(save.isPending)
  // Local reading of the gate, so the button opens the moment the learner
  // reaches the end rather than after the next autosave round-trip.
  const [fraction, setFraction] = useState(0)

  if (!course) return <Navigate to={paths.learning} replace />

  const found = findLesson(course, lessonId)
  if (!found) return <Navigate to={paths.learning} replace />

  if (isLoading || !enrollment) {
    return <Spinner label="Dars yuklanmoqda…" />
  }

  const { lesson, module, moduleIndex } = found
  const state = lessonStateOf(enrollment, lesson.id)

  // A suspended course keeps what the learner already finished: only the
  // lessons they had not reached yet close behind them.
  if (enrollment.status === 'suspended' && state?.status !== 'completed') {
    return <Navigate to={courseSuspendedPath(course.id)} replace />
  }

  const progress = courseProgress(course, enrollment)
  const lessonIndex = module.lessons.findIndex((item) => item.id === lesson.id)

  const outline = (
    <div className="flex flex-col gap-4">
      <CourseProgressCard progress={progress} />
      <CourseOutline course={course} enrollment={enrollment} activeLessonId={lesson.id} />
    </div>
  )

  if (state?.status === 'locked') {
    const open = enrollment.lessons.find((item) => item.status === 'current')
    return (
      <div className="flex flex-col gap-4">
        <LessonBreadcrumb courseTitle={course.title} />
        <div className="grid gap-5 large:grid-cols-[minmax(0,1fr)_340px]">
          <section className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-card px-6 py-14 text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-brand-softer text-ink-muted">
              <LockIcon size={26} />
            </span>
            <h1 className="font-display text-2xl font-bold text-ink">Bu dars hali yopiq</h1>
            <p className="max-w-md text-ink-muted">
              {lockReason(course, enrollment, lesson.id) ?? 'Bu dars hali ochilmagan.'}
            </p>
            {open ? (
              <Link
                to={lessonPath(course.id, open.lessonId)}
                className="mt-2 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-on-brand transition-colors hover:bg-brand-hover"
              >
                Ochiq darsga qaytish
                <ArrowRightIcon size={16} />
              </Link>
            ) : null}
          </section>
          {outline}
        </div>
      </div>
    )
  }

  const videoReady = Boolean(state?.videoCompleted) || fraction >= WATCHED_THRESHOLD
  const quizPassed = Boolean(state?.quizPassed)
  const nextLesson = module.lessons[lessonIndex + 1] ?? null
  const watchedPercent = Math.round(Math.max(fraction, 0) * 100)

  return (
    <div className="flex flex-col gap-4">
      <LessonBreadcrumb courseTitle={course.title} />

      <div className="grid gap-5 large:grid-cols-[minmax(0,1fr)_340px] large:items-start">
        <div className="flex flex-col gap-5">
          <article className="overflow-hidden rounded-2xl border border-line bg-card">
            <LessonPlayer
              key={lesson.id}
              lesson={lesson}
              poster={course.cover}
              watchedSeconds={state?.watchedSeconds ?? 0}
              completed={Boolean(state?.videoCompleted)}
              onSave={(payload) =>
                save.mutate({ courseId: course.id, lessonId: lesson.id, ...payload })
              }
              onFractionChange={setFraction}
            />

            <div className="flex flex-col gap-3 p-5">
              <div className="flex min-h-5 items-center gap-2 text-xs">
                {saveStatus === 'saving' ? (
                  <span className="flex items-center gap-1.5 text-ink-muted">
                    <RefreshIcon size={13} />
                    Progress saqlanmoqda...
                  </span>
                ) : saveStatus === 'saved' ? (
                  <span className="flex items-center gap-1.5 text-brand-hover">
                    <CheckCircleIcon size={13} />
                    Saqlandi
                  </span>
                ) : null}
              </div>

              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 flex-col gap-2">
                  <span className="w-fit rounded-lg bg-brand-softer px-2.5 py-1 text-xs font-medium text-brand">
                    {moduleIndex + 1}-Modul, {lessonIndex + 1}-Dars
                  </span>
                  <h1 className="font-display text-2xl font-bold text-ink">
                    {lesson.number} {lesson.title}
                  </h1>
                </div>

                {enrollment.status === 'suspended' ? (
                  // Read-only: offering a way forward would only lead back to
                  // the suspension screen.
                  <p className="flex items-center gap-2 rounded-xl bg-danger-soft px-4 py-2.5 text-sm text-danger">
                    <AlertIcon size={16} />
                    Kurs to'xtatilgan — bu dars faqat ko'rish uchun ochiq
                  </p>
                ) : (
                  <LessonAction
                    courseId={course.id}
                    quizId={lesson.quizId}
                    videoReady={videoReady}
                    quizPassed={quizPassed}
                    nextLessonId={nextLesson?.id ?? null}
                    examId={module.examId}
                    watchedPercent={watchedPercent}
                  />
                )}
              </div>
            </div>
          </article>

          <LessonTranscript blocks={lesson.transcript} />
        </div>

        {outline}
      </div>
    </div>
  )
}

interface LessonActionProps {
  courseId: string
  quizId: string
  videoReady: boolean
  quizPassed: boolean
  nextLessonId: string | null
  examId: string
  watchedPercent: number
}

/**
 * The one control that moves the learner forward. It shows the single next
 * step rather than a row of buttons, and says why when it cannot be pressed —
 * a dead button with no explanation reads as a bug.
 */
function LessonAction({
  courseId,
  quizId,
  videoReady,
  quizPassed,
  nextLessonId,
  examId,
  watchedPercent,
}: LessonActionProps) {
  const buttonClass =
    'inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-on-brand transition-colors hover:bg-brand-hover'

  if (!videoReady) {
    return (
      <div className="flex flex-col items-end gap-1.5">
        <button type="button" disabled className={`${buttonClass} cursor-not-allowed opacity-45`}>
          Testni boshlash
          <ArrowRightIcon size={16} />
        </button>
        <p className="text-xs text-ink-muted">
          Videoni oxirigacha ko'ring ({watchedPercent}% / {Math.round(WATCHED_THRESHOLD * 100)}%)
        </p>
      </div>
    )
  }

  if (!quizPassed) {
    return (
      <div className="flex flex-col items-end gap-1.5">
        <Link to={quizPath(courseId, quizId)} className={buttonClass}>
          Testni boshlash
          <ArrowRightIcon size={16} />
        </Link>
        <p className="text-xs text-ink-muted">Test keyingi darsni ochadi</p>
      </div>
    )
  }

  return (
    <Link
      to={nextLessonId ? lessonPath(courseId, nextLessonId) : quizPath(courseId, examId)}
      className={buttonClass}
    >
      {nextLessonId ? 'Keyingi dars' : 'Modul nazoratiga o‘tish'}
      <ArrowRightIcon size={16} />
    </Link>
  )
}
