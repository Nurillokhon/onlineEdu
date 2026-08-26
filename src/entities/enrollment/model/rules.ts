/**
 * The gate constants. They live on the server once the API exists; they are
 * repeated here only so the mock behaves like it, and so the UI can say out
 * loud what it is asking for ("kamida 60%").
 */

/** Fraction of a lesson video that must actually be watched. */
export const WATCHED_THRESHOLD = 0.95

/** Percentage needed to pass a lesson quiz. */
export const LESSON_PASS_SCORE = 60

/** Percentage needed to pass a module exam — the real checkpoint. */
export const EXAM_PASS_SCORE = 75

/** Exam attempts before the course is suspended. Lesson quizzes are unlimited. */
export const EXAM_ATTEMPTS = 3

export const LESSON_QUESTION_COUNT = 10
export const EXAM_QUESTION_COUNT = 25

/** Seconds. */
export const LESSON_TIME_LIMIT = 15 * 60
export const EXAM_TIME_LIMIT = 35 * 60
