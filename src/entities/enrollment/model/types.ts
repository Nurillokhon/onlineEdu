/**
 * Learner state for one course. The backend owns all of it: the client never
 * decides whether a lesson is unlocked, it renders the status it is given.
 */

export type LessonStatus = 'completed' | 'current' | 'locked'

export interface LessonState {
  lessonId: string
  status: LessonStatus
  /** Cumulative unique seconds watched — the 95% gate reads this. */
  watchedSeconds: number
  videoCompleted: boolean
  quizPassed: boolean
  /** Best percentage so far, null until the first submitted attempt. */
  bestScore: number | null
}

export type ExamStatus = 'locked' | 'available' | 'passed' | 'failed'

export interface ExamState {
  examId: string
  status: ExamStatus
  attemptsUsed: number
  bestScore: number | null
}

export type EnrollmentStatus = 'active' | 'completed' | 'suspended'

export interface Enrollment {
  courseId: string
  status: EnrollmentStatus
  lessons: LessonState[]
  exams: ExamState[]
}

export type QuizKind = 'lesson' | 'exam'

export interface QuizOption {
  id: string
  text: string
}

export interface QuizQuestion {
  id: string
  text: string
  options: QuizOption[]
}

/**
 * A quiz as the client sees it: questions and options, never answers. Grading
 * happens on the server so the correct option cannot be read out of the page.
 */
export interface Quiz {
  id: string
  kind: QuizKind
  title: string
  questions: QuizQuestion[]
  /** Seconds. The client counts down; the server owns the deadline. */
  timeLimit: number
  /** Percentage needed to pass, shown to the learner before they start. */
  passScore: number
  /** Null when there is no limit, as on lesson quizzes. */
  attemptsAllowed: number | null
  attemptsUsed: number
}

export interface QuizAttempt {
  id: string
  quizId: string
  courseId: string
  /** Epoch milliseconds. Survives a reload, so the timer cannot be reset. */
  deadline: number
  answers: Record<string, string>
  submittedAt: number | null
}

export interface QuizResult {
  quizId: string
  correct: number
  total: number
  /** Percentage, rounded. */
  score: number
  passed: boolean
  /** Questions answered wrong. The correct options are deliberately absent. */
  wrongQuestionIds: string[]
  /** Null when unlimited. */
  attemptsLeft: number | null
  /** True when the last exam attempt was spent and the course was suspended. */
  courseSuspended: boolean
  /** Where to continue, when the attempt passed. */
  nextLessonId: string | null
}
