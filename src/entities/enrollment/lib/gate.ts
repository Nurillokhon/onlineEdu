/**
 * Turns the server's enrollment into the handful of numbers and labels the UI
 * shows. Nothing here decides access — the status fields already carry that.
 */
import { lessonCount, type Course, type Lesson } from '@/entities/course'
import { WATCHED_THRESHOLD } from '../model/rules'
import type { Enrollment, LessonState } from '../model/types'

export interface CourseProgress {
  completed: number
  total: number
  /** 0–100, rounded. */
  percent: number
}

export function courseProgress(course: Course, enrollment?: Enrollment): CourseProgress {
  const total = lessonCount(course)
  const completed =
    enrollment?.lessons.filter((state) => state.status === 'completed').length ?? 0
  return { completed, total, percent: total === 0 ? 0 : Math.round((completed / total) * 100) }
}

export function lessonStateOf(enrollment: Enrollment | undefined, lessonId: string) {
  return enrollment?.lessons.find((state) => state.lessonId === lessonId)
}

/** How much of the video counts as watched, 0–1. */
export function watchedFraction(state: LessonState | undefined, lesson: Lesson) {
  if (!state || lesson.duration === 0) return 0
  return Math.min(1, state.watchedSeconds / lesson.duration)
}

/** Seconds that still have to be watched before the quiz opens. */
export function secondsLeftToWatch(state: LessonState | undefined, lesson: Lesson) {
  const required = lesson.duration * WATCHED_THRESHOLD
  const watched = state?.watchedSeconds ?? 0
  return Math.max(0, Math.ceil(required - watched))
}

/** Why a lesson cannot be opened, or null when it can. */
export function lockReason(
  course: Course,
  enrollment: Enrollment | undefined,
  lessonId: string,
): string | null {
  if (!enrollment) return null
  if (enrollment.status === 'suspended') {
    return "Kurs vaqtincha to'xtatilgan."
  }

  const state = lessonStateOf(enrollment, lessonId)
  if (!state || state.status !== 'locked') return null

  const lessons = course.curriculum.flatMap((module) => module.lessons)
  const index = lessons.findIndex((lesson) => lesson.id === lessonId)
  const previous = index > 0 ? lessons[index - 1] : null

  // A locked lesson at the head of a module is waiting on the module exam,
  // not on the lesson before it.
  const moduleIndex = course.curriculum.findIndex((module) =>
    module.lessons.some((lesson) => lesson.id === lessonId),
  )
  const module = course.curriculum[moduleIndex]
  const firstOfModule = module?.lessons[0]?.id === lessonId

  if (firstOfModule && moduleIndex > 0) {
    return `Avval ${moduleIndex}-modul oraliq nazoratidan o'ting.`
  }
  if (previous) {
    return `Avval ${previous.number} darsning testidan o'ting.`
  }
  return 'Bu dars hali ochilmagan.'
}

/** The lesson a "Davom etish" link should open. */
export function resumeLessonId(enrollment: Enrollment | undefined) {
  if (!enrollment) return null
  const current = enrollment.lessons.find((state) => state.status === 'current')
  if (current) return current.lessonId
  const last = enrollment.lessons.filter((state) => state.status === 'completed').at(-1)
  return last?.lessonId ?? enrollment.lessons[0]?.lessonId ?? null
}
