import { usePersistentState } from '@/shared/lib'

const STORAGE_KEY = 'eduflow-saved-courses'

/** The learner's bookmarked courses, kept across reloads. */
export function useSavedCourses() {
  const [saved, setSaved] = usePersistentState<string[]>(STORAGE_KEY, [])

  function toggle(courseId: string) {
    setSaved((current) =>
      current.includes(courseId)
        ? current.filter((id) => id !== courseId)
        : [...current, courseId],
    )
  }

  return {
    saved,
    isSaved: (courseId: string) => saved.includes(courseId),
    toggle,
  }
}
