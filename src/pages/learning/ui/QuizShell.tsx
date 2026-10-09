/** @format */

import { LessonBreadcrumb } from "./LessonBreadcrumb";

/** Shared two-column frame, so every quiz state keeps the outline in place. */
export function QuizShell({
  children,
  outline,
  courseTitle,
}: {
  children: React.ReactNode;
  outline: React.ReactNode;
  courseTitle: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <LessonBreadcrumb courseTitle={courseTitle} />
      <div className="grid gap-5 large:grid-cols-[minmax(0,1fr)_340px] large:items-start">
        <div className="rounded-2xl border border-line bg-card">{children}</div>
        {outline}
      </div>
    </div>
  );
}
