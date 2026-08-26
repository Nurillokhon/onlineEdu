/** @format */

export const paths = {
  home: "/",
  courses: "/courses",
  courseDetail: "/courses/:courseId",
  learning: "/learning",
  lesson: "/learning/:courseId/:lessonId",
  lessonQuiz: "/learning/:courseId/test/:quizId",
  quizResult: "/learning/:courseId/test/:quizId/natija",
  courseSuspended: "/learning/:courseId/toxtatildi",
  applications: "/applications",
  payments: "/payments",
  settings: "/settings",
  login: "/login",
  register: "/register",
  profile: "/profile",
} as const;

/** Builds a concrete link for {@link paths.courseDetail}. */
export function courseDetailPath(courseId: string) {
  return `/courses/${courseId}`;
}

/** Builds a concrete link for {@link paths.lesson}. */
export function lessonPath(courseId: string, lessonId: string) {
  return `/learning/${courseId}/${lessonId}`;
}

/** Builds a concrete link for {@link paths.lessonQuiz}. */
export function quizPath(courseId: string, quizId: string) {
  return `/learning/${courseId}/test/${quizId}`;
}

/** Builds a concrete link for {@link paths.quizResult}. */
export function quizResultPath(courseId: string, quizId: string) {
  return `/learning/${courseId}/test/${quizId}/natija`;
}

/** Builds a concrete link for {@link paths.courseSuspended}. */
export function courseSuspendedPath(courseId: string) {
  return `/learning/${courseId}/toxtatildi`;
}
