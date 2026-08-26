import type { Course } from '@/entities/course'
import { useEnrollmentsQuery } from '../api/queries'
import { courseProgress, resumeLessonId } from './gate'

/**
 * Course progress for the list screens. They all used to read a hand-written
 * `course.progress`; this replaces it with the one number the server keeps.
 */
export function useCourseProgressMap() {
  const { data, isLoading } = useEnrollmentsQuery()
  const byId = new Map((data ?? []).map((enrollment) => [enrollment.courseId, enrollment]))

  return {
    isLoading,
    progressOf: (course: Course) => courseProgress(course, byId.get(course.id)),
    statusOf: (courseId: string) => byId.get(courseId)?.status ?? 'active',
    resumeLessonOf: (courseId: string) => resumeLessonId(byId.get(courseId)),
  }
}
