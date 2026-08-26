import * as server from '../model/server'
import type { Enrollment, Quiz, QuizAttempt, QuizResult } from '../model/types'

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

// Demo/mock only — swap these bodies for real `fetch` calls against
// `API_BASE_URL` (see src/shared/config/env.ts) once a backend exists. The
// signatures are what the player and the quiz pages depend on, so keep them
// stable when doing that swap. Grading in particular must stay server-side:
// nothing here may return a correct answer to the client.

/** GET /courses/:courseId/enrollment */
export async function fetchEnrollment(courseId: string): Promise<Enrollment> {
  return delay(server.getEnrollment(courseId), 200)
}

/** GET /enrollments */
export async function fetchEnrollments(): Promise<Enrollment[]> {
  return delay(server.getAllEnrollments(), 200)
}

/** PATCH /courses/:courseId/lessons/:lessonId/progress */
export async function saveWatchedProgress(payload: {
  courseId: string
  lessonId: string
  watchedSeconds: number
  /** Measured length of the media, so the 95% gate matches what was played. */
  duration: number
}): Promise<Enrollment> {
  return delay(
    server.saveWatched(
      payload.courseId,
      payload.lessonId,
      payload.watchedSeconds,
      payload.duration,
    ),
    400,
  )
}

/** GET /courses/:courseId/quizzes/:quizId — questions only, never answers. */
export async function fetchQuiz(courseId: string, quizId: string): Promise<Quiz> {
  return delay(server.getQuiz(courseId, quizId), 250)
}

/** GET /courses/:courseId/quizzes/:quizId/access */
export async function fetchQuizAccess(courseId: string, quizId: string) {
  return delay(server.quizAccess(courseId, quizId), 150)
}

/** POST /courses/:courseId/quizzes/:quizId/attempts */
export async function startQuizAttempt(payload: {
  courseId: string
  quizId: string
}): Promise<QuizAttempt> {
  return delay(server.startAttempt(payload.courseId, payload.quizId), 250)
}

/** GET /courses/:courseId/quizzes/:quizId/attempt */
export async function fetchQuizAttempt(
  courseId: string,
  quizId: string,
): Promise<QuizAttempt | null> {
  return delay(server.getAttempt(courseId, quizId), 150)
}

/** PUT /attempts/:attemptId/answers/:questionId */
export async function answerQuizQuestion(payload: {
  courseId: string
  quizId: string
  questionId: string
  optionId: string
}): Promise<QuizAttempt | null> {
  return delay(
    server.answerQuestion(payload.courseId, payload.quizId, payload.questionId, payload.optionId),
    150,
  )
}

/** POST /attempts/:attemptId/submit — the server grades and answers with the result. */
export async function submitQuizAttempt(payload: {
  courseId: string
  quizId: string
}): Promise<QuizResult> {
  return delay(server.submitAttempt(payload.courseId, payload.quizId), 500)
}

/** GET /courses/:courseId/quizzes/:quizId/result — the last graded attempt. */
export async function fetchQuizResult(
  courseId: string,
  quizId: string,
): Promise<QuizResult | null> {
  return delay(server.getLastResult(courseId, quizId), 150)
}

/** Demo-only escape hatch, wired to the Settings page. */
export async function resetLearningProgress(): Promise<void> {
  server.resetProgress()
  return delay(undefined, 200)
}
