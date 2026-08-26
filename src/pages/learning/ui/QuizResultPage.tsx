import { Link, Navigate, useParams } from 'react-router-dom'
import { courses } from '@/entities/course'
import {
  useEnrollmentQuery,
  useQuizQuery,
  useQuizResultQuery,
} from '@/entities/enrollment'
import { courseSuspendedPath, lessonPath, paths, quizPath } from '@/shared/config/routes'
import { AlertIcon, ArrowRightIcon, CheckCircleIcon, RefreshIcon, Spinner } from '@/shared/ui'

/**
 * The attempt result. Wrong questions are listed by number only: with retries
 * still on the table, handing over the correct answers would turn the next
 * attempt into a transcription exercise.
 */
export function QuizResultPage() {
  const { courseId = '', quizId = '' } = useParams()
  const course = courses.find((item) => item.id === courseId)
  const { data: result, isLoading } = useQuizResultQuery(courseId, quizId)
  const { data: quiz } = useQuizQuery(courseId, quizId)
  const { data: enrollment } = useEnrollmentQuery(courseId)

  if (!course) return <Navigate to={paths.learning} replace />
  if (isLoading) return <Spinner label="Natija yuklanmoqda…" />
  if (!result) return <Navigate to={paths.learning} replace />
  if (result.courseSuspended) return <Navigate to={courseSuspendedPath(courseId)} replace />

  const wrongNumbers = quiz
    ? result.wrongQuestionIds
        .map((id) => quiz.questions.findIndex((question) => question.id === id) + 1)
        .filter((number) => number > 0)
        .sort((first, second) => first - second)
    : []

  const canRetry = result.attemptsLeft === null || result.attemptsLeft > 0

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5 py-6">
      <section className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-card px-6 py-10 text-center">
        <span
          className={`grid size-16 place-items-center rounded-2xl ${
            result.passed ? 'bg-brand-softer text-brand-hover' : 'bg-danger-soft text-danger'
          }`}
        >
          {result.passed ? <CheckCircleIcon size={30} /> : <AlertIcon size={30} />}
        </span>

        <div className="flex flex-col gap-1">
          <h1 className="font-display text-2xl font-bold text-ink">
            {result.passed ? 'Test muvaffaqiyatli yakunlandi' : 'Test topshirilmadi'}
          </h1>
          <p className="text-ink-muted">
            {result.total} savoldan {result.correct} tasi to'g'ri
            {quiz ? ` • o'tish balli ${quiz.passScore}%` : ''}
          </p>
        </div>

        <p
          className={`font-display text-4xl font-bold ${
            result.passed ? 'text-brand' : 'text-danger'
          }`}
        >
          {result.score}%
        </p>

        {result.attemptsLeft === null ? null : (
          <p className="text-sm text-ink-muted">
            Sizda {result.attemptsLeft} ta urinish qoldi.
          </p>
        )}
      </section>

      {wrongNumbers.length > 0 ? (
        <section className="flex flex-col gap-3 rounded-2xl border border-line bg-card p-5">
          <h2 className="font-display text-lg font-semibold text-ink">Xato javoblar</h2>
          <p className="text-sm text-ink-muted">
            Quyidagi savollarda xato qildingiz. To'g'ri javoblar ko'rsatilmaydi — mavzuni darsdan
            qayta ko'rib chiqing.
          </p>
          <ul className="flex flex-wrap gap-2">
            {wrongNumbers.map((number) => (
              <li
                key={number}
                className="rounded-lg bg-danger-soft px-3 py-1.5 text-sm font-medium text-danger"
              >
                {number}-savol
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="flex flex-wrap justify-center gap-3">
        {result.passed && result.nextLessonId ? (
          <Link
            to={lessonPath(courseId, result.nextLessonId)}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-on-brand transition-colors hover:bg-brand-hover"
          >
            Keyingi dars
            <ArrowRightIcon size={16} />
          </Link>
        ) : null}

        {!result.passed && canRetry ? (
          <Link
            to={quizPath(courseId, quizId)}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-on-brand transition-colors hover:bg-brand-hover"
          >
            <RefreshIcon size={16} />
            Qayta urinish
          </Link>
        ) : null}

        <Link
          to={
            enrollment?.lessons.find((state) => state.status === 'current')
              ? lessonPath(
                  courseId,
                  enrollment.lessons.find((state) => state.status === 'current')!.lessonId,
                )
              : paths.learning
          }
          className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-brand-softer"
        >
          Darsga qaytish
        </Link>
      </div>
    </div>
  )
}
