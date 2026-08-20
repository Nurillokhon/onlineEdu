/** @format */

export const paths = {
  home: "/",
  courses: "/courses",
  courseDetail: "/courses/:courseId",
  learning: "/learning",
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
