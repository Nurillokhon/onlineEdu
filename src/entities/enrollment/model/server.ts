/**
 * The mock backend. Everything the learner is not allowed to decide lives
 * here: lesson locks, attempt counts, correct answers and grading. React never
 * imports this file — it goes through `api/requests.ts`, so replacing the mock
 * with real endpoints is a change to that file alone.
 */
import { allLessons, courses, findLesson, type Course } from '@/entities/course'
import {
  EXAM_ATTEMPTS,
  EXAM_PASS_SCORE,
  EXAM_QUESTION_COUNT,
  EXAM_TIME_LIMIT,
  LESSON_PASS_SCORE,
  LESSON_QUESTION_COUNT,
  LESSON_TIME_LIMIT,
  WATCHED_THRESHOLD,
} from './rules'
import type {
  Enrollment,
  Quiz,
  QuizAttempt,
  QuizQuestion,
  QuizResult,
} from './types'

const STORAGE_KEY = 'eduflow:enrollments'
const ATTEMPTS_KEY = 'eduflow:quiz-attempts'
const RESULTS_KEY = 'eduflow:quiz-results'

// ---------------------------------------------------------------- storage

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // A full or blocked store only costs the demo its persistence.
  }
}

// ---------------------------------------------------------------- state

function blankEnrollment(course: Course): Enrollment {
  return {
    courseId: course.id,
    status: 'active',
    lessons: allLessons(course).map((lesson) => ({
      lessonId: lesson.id,
      status: 'locked',
      watchedSeconds: 0,
      videoCompleted: false,
      quizPassed: false,
      bestScore: null,
    })),
    exams: course.curriculum.map((module) => ({
      examId: module.examId,
      status: 'locked',
      attemptsUsed: 0,
      bestScore: null,
    })),
  }
}

/**
 * How far into each course the demo learner already is, so the dashboards are
 * not empty on a first visit. `resetProgress()` puts this back.
 */
const SEED_COMPLETED: Record<string, number> = {
  'system-design': 4,
  frontend: 2,
  'data-science': 1,
  'ux-ui': 0,
}

function seededEnrollment(course: Course): Enrollment {
  const enrollment = blankEnrollment(course)
  const completed = SEED_COMPLETED[course.id] ?? 0

  const lessons = allLessons(course)
  for (const [index, state] of enrollment.lessons.slice(0, completed).entries()) {
    state.videoCompleted = true
    state.quizPassed = true
    state.bestScore = 80
    state.watchedSeconds = lessons[index].duration
  }

  // An exam whose module is fully finished counts as passed in the seed, so
  // the learner lands mid-course rather than stuck at a checkpoint.
  let index = 0
  for (const [moduleIndex, module] of course.curriculum.entries()) {
    const finished = module.lessons.every((_, offset) => index + offset < completed)
    index += module.lessons.length
    if (!finished) break
    enrollment.exams[moduleIndex].status = 'passed'
    enrollment.exams[moduleIndex].attemptsUsed = 1
    enrollment.exams[moduleIndex].bestScore = 88
  }

  return recompute(course, enrollment)
}

function loadAll(): Record<string, Enrollment> {
  const stored = read<Record<string, Enrollment> | null>(STORAGE_KEY, null)
  if (stored) return stored

  const seeded: Record<string, Enrollment> = {}
  for (const course of courses) seeded[course.id] = seededEnrollment(course)
  write(STORAGE_KEY, seeded)
  return seeded
}

function save(enrollment: Enrollment) {
  const all = loadAll()
  all[enrollment.courseId] = enrollment
  write(STORAGE_KEY, all)
}

function courseOf(courseId: string) {
  const course = courses.find((item) => item.id === courseId)
  if (!course) throw new Error(`Noma'lum kurs: ${courseId}`)
  return course
}

// ---------------------------------------------------------------- the gate

/**
 * Derives every lock from what the learner has actually finished. This is the
 * only place that decides access; nothing upstream may set a status by hand.
 */
function recompute(course: Course, enrollment: Enrollment): Enrollment {
  const byId = new Map(enrollment.lessons.map((state) => [state.lessonId, state]))
  let moduleUnlocked = true

  for (const [moduleIndex, module] of course.curriculum.entries()) {
    const exam = enrollment.exams[moduleIndex]
    let previousDone = true

    for (const lesson of module.lessons) {
      const state = byId.get(lesson.id)
      if (!state) continue
      const done = state.videoCompleted && state.quizPassed
      state.status = done ? 'completed' : moduleUnlocked && previousDone ? 'current' : 'locked'
      previousDone = done
    }

    const moduleDone = module.lessons.every((lesson) => byId.get(lesson.id)?.status === 'completed')

    if (exam.status !== 'passed') {
      const spent = exam.attemptsUsed >= EXAM_ATTEMPTS
      exam.status = !moduleUnlocked || !moduleDone ? 'locked' : spent ? 'failed' : 'available'
    }

    moduleUnlocked = moduleUnlocked && exam.status === 'passed'
  }

  const failed = enrollment.exams.some((exam) => exam.status === 'failed')
  const allPassed = enrollment.exams.every((exam) => exam.status === 'passed')
  enrollment.status = failed ? 'suspended' : allPassed ? 'completed' : 'active'

  return enrollment
}

export function getEnrollment(courseId: string): Enrollment {
  const course = courseOf(courseId)
  const stored = loadAll()[courseId]
  const enrollment = stored ?? blankEnrollment(course)
  // Recomputing on read keeps stored state honest if the curriculum changed.
  return recompute(course, structuredClone(enrollment))
}

export function getAllEnrollments(): Enrollment[] {
  return courses.map((course) => getEnrollment(course.id))
}

/** The lesson the learner should land on: the first one still open. */
export function nextOpenLessonId(courseId: string): string | null {
  const enrollment = getEnrollment(courseId)
  const current = enrollment.lessons.find((state) => state.status === 'current')
  if (current) return current.lessonId
  const last = enrollment.lessons.filter((state) => state.status === 'completed').at(-1)
  return last?.lessonId ?? enrollment.lessons[0]?.lessonId ?? null
}

// ---------------------------------------------------------------- progress

/**
 * `duration` is what the player measured on the actual media. A real backend
 * reads it off the video asset instead of trusting the client; the mock has no
 * asset to read, and the demo clips are not the length the curriculum claims.
 */
export function saveWatched(
  courseId: string,
  lessonId: string,
  watchedSeconds: number,
  duration?: number,
) {
  const course = courseOf(courseId)
  const enrollment = getEnrollment(courseId)
  const state = enrollment.lessons.find((item) => item.lessonId === lessonId)
  const found = findLesson(course, lessonId)
  if (!state || !found) return enrollment

  if (state.status === 'locked') return enrollment

  const total = duration && duration > 0 ? duration : found.lesson.duration

  // Watched time only ever grows: re-watching must not undo the gate.
  state.watchedSeconds = Math.max(state.watchedSeconds, Math.round(watchedSeconds))
  if (state.watchedSeconds >= total * WATCHED_THRESHOLD) {
    state.videoCompleted = true
  }

  const next = recompute(course, enrollment)
  save(next)
  return next
}

export function resetProgress() {
  const seeded: Record<string, Enrollment> = {}
  for (const course of courses) seeded[course.id] = seededEnrollment(course)
  write(STORAGE_KEY, seeded)
  write(ATTEMPTS_KEY, {})
  write(RESULTS_KEY, {})
}

// ---------------------------------------------------------------- quizzes

/** Small deterministic hash, so a quiz looks the same on every reload. */
function hash(input: string) {
  let value = 0
  for (let index = 0; index < input.length; index += 1) {
    value = (value * 31 + input.charCodeAt(index)) | 0
  }
  return Math.abs(value)
}

// Demo questions. The backend replaces every string here; only the shape and
// the count matter to the UI.
const OPTION_SHAPES = [
  "asosiy tushunchani to'g'ri ta'riflaydi",
  'faqat qisman to‘g‘ri, muhim shart tushib qolgan',
  'boshqa mavzuga tegishli ta’rif',
  'keng tarqalgan xato tasavvur',
]

function buildQuestions(quizId: string, topic: string, count: number): QuizQuestion[] {
  return Array.from({ length: count }, (_, index) => {
    const id = `${quizId}-q${index + 1}`
    return {
      id,
      text: `${index + 1}. «${topic}» mavzusi bo'yicha quyidagi fikrlardan qaysi biri to'g'ri?`,
      options: OPTION_SHAPES.map((shape, optionIndex) => ({
        id: `${id}-o${optionIndex + 1}`,
        text: `Ushbu variant ${shape}.`,
      })),
    }
  })
}

/** The answer key never leaves this module. */
function correctOptionId(questionId: string) {
  return `${questionId}-o${(hash(questionId) % OPTION_SHAPES.length) + 1}`
}

function locateQuiz(courseId: string, quizId: string) {
  const course = courseOf(courseId)

  for (const lesson of allLessons(course)) {
    if (lesson.quizId === quizId) return { course, kind: 'lesson' as const, lesson }
  }
  for (const [index, module] of course.curriculum.entries()) {
    if (module.examId === quizId) {
      return { course, kind: 'exam' as const, module, moduleIndex: index }
    }
  }
  throw new Error(`Noma'lum test: ${quizId}`)
}

export function getQuiz(courseId: string, quizId: string): Quiz {
  const found = locateQuiz(courseId, quizId)
  const enrollment = getEnrollment(courseId)

  if (found.kind === 'lesson') {
    return {
      id: quizId,
      kind: 'lesson',
      title: `${found.lesson.number} ${found.lesson.title} — Mavzu testi`,
      questions: buildQuestions(quizId, found.lesson.title, LESSON_QUESTION_COUNT),
      timeLimit: LESSON_TIME_LIMIT,
      passScore: LESSON_PASS_SCORE,
      attemptsAllowed: null,
      attemptsUsed: 0,
    }
  }

  const exam = enrollment.exams[found.moduleIndex]
  return {
    id: quizId,
    kind: 'exam',
    title: `${found.moduleIndex + 1}-Modul oraliq nazorati`,
    questions: buildQuestions(quizId, found.module.title, EXAM_QUESTION_COUNT),
    timeLimit: EXAM_TIME_LIMIT,
    passScore: EXAM_PASS_SCORE,
    attemptsAllowed: EXAM_ATTEMPTS,
    attemptsUsed: exam.attemptsUsed,
  }
}

/** Whether the learner is allowed to open this quiz at all. */
export function quizAccess(courseId: string, quizId: string) {
  const found = locateQuiz(courseId, quizId)
  const enrollment = getEnrollment(courseId)

  if (enrollment.status === 'suspended') {
    return { allowed: false, reason: "Kurs vaqtincha to'xtatilgan." }
  }

  if (found.kind === 'lesson') {
    const state = enrollment.lessons.find((item) => item.lessonId === found.lesson.id)
    if (!state || state.status === 'locked') {
      return { allowed: false, reason: 'Bu dars hali ochilmagan.' }
    }
    if (!state.videoCompleted) {
      return { allowed: false, reason: "Avval video darsni oxirigacha ko'ring." }
    }
    return { allowed: true, reason: null }
  }

  const exam = enrollment.exams[found.moduleIndex]
  if (exam.status === 'locked') {
    return { allowed: false, reason: 'Avval moduldagi barcha darslarni yakunlang.' }
  }
  if (exam.status === 'failed') {
    return { allowed: false, reason: 'Urinishlar tugadi.' }
  }
  return { allowed: true, reason: null }
}

// ---------------------------------------------------------------- attempts

function loadAttempts(): Record<string, QuizAttempt> {
  return read<Record<string, QuizAttempt>>(ATTEMPTS_KEY, {})
}

function saveAttempt(attempt: QuizAttempt) {
  const all = loadAttempts()
  all[attempt.id] = attempt
  write(ATTEMPTS_KEY, all)
}

function attemptKey(courseId: string, quizId: string) {
  return `${courseId}:${quizId}`
}

/**
 * Opens an attempt, or returns the one already running. The attempt is spent
 * the moment it starts: closing the tab does not hand back a free retry.
 */
export function startAttempt(courseId: string, quizId: string): QuizAttempt {
  const running = loadAttempts()[attemptKey(courseId, quizId)]
  if (running && running.submittedAt === null) return running

  const quiz = getQuiz(courseId, quizId)
  const attempt: QuizAttempt = {
    id: attemptKey(courseId, quizId),
    quizId,
    courseId,
    deadline: Date.now() + quiz.timeLimit * 1000,
    answers: {},
    submittedAt: null,
  }
  saveAttempt(attempt)

  if (quiz.kind === 'exam') {
    const found = locateQuiz(courseId, quizId)
    if (found.kind === 'exam') {
      const course = courseOf(courseId)
      const enrollment = getEnrollment(courseId)
      enrollment.exams[found.moduleIndex].attemptsUsed += 1
      save(recompute(course, enrollment))
    }
  }

  return attempt
}

export function getAttempt(courseId: string, quizId: string): QuizAttempt | null {
  return loadAttempts()[attemptKey(courseId, quizId)] ?? null
}

/** Records one answer. Answers past the deadline are refused. */
export function answerQuestion(
  courseId: string,
  quizId: string,
  questionId: string,
  optionId: string,
) {
  const attempt = getAttempt(courseId, quizId)
  if (!attempt || attempt.submittedAt !== null) return attempt
  if (Date.now() > attempt.deadline) return attempt

  attempt.answers[questionId] = optionId
  saveAttempt(attempt)
  return attempt
}

export function submitAttempt(courseId: string, quizId: string): QuizResult {
  const course = courseOf(courseId)
  const found = locateQuiz(courseId, quizId)
  const quiz = getQuiz(courseId, quizId)
  const attempt = getAttempt(courseId, quizId) ?? startAttempt(courseId, quizId)
  const enrollment = getEnrollment(courseId)

  const wrongQuestionIds = quiz.questions
    .filter((question) => attempt.answers[question.id] !== correctOptionId(question.id))
    .map((question) => question.id)

  const total = quiz.questions.length
  const correct = total - wrongQuestionIds.length
  const score = Math.round((correct / total) * 100)
  const passed = score >= quiz.passScore

  attempt.submittedAt = Date.now()
  saveAttempt(attempt)

  let attemptsLeft: number | null = null

  if (found.kind === 'lesson') {
    const state = enrollment.lessons.find((item) => item.lessonId === found.lesson.id)
    if (state) {
      state.bestScore = Math.max(state.bestScore ?? 0, score)
      state.quizPassed = state.quizPassed || passed
    }
  } else {
    const exam = enrollment.exams[found.moduleIndex]
    exam.bestScore = Math.max(exam.bestScore ?? 0, score)
    if (passed) exam.status = 'passed'
    attemptsLeft = Math.max(0, EXAM_ATTEMPTS - exam.attemptsUsed)
  }

  const next = recompute(course, enrollment)
  save(next)

  const result: QuizResult = {
    quizId,
    correct,
    total,
    score,
    passed,
    wrongQuestionIds,
    attemptsLeft,
    courseSuspended: next.status === 'suspended',
    nextLessonId: passed ? nextOpenLessonId(courseId) : null,
  }

  // Kept so the result page survives a reload instead of dead-ending.
  const results = read<Record<string, QuizResult>>(RESULTS_KEY, {})
  results[attemptKey(courseId, quizId)] = result
  write(RESULTS_KEY, results)

  return result
}

export function getLastResult(courseId: string, quizId: string): QuizResult | null {
  return read<Record<string, QuizResult>>(RESULTS_KEY, {})[attemptKey(courseId, quizId)] ?? null
}
