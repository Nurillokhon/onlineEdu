/** @format */

import { Link, Navigate, useParams } from "react-router-dom";
import { courses, findLesson } from "@/entities/course";
import {
  courseProgress,
  lessonStateOf,
  lockReason,
  useEnrollmentQuery,
} from "@/entities/enrollment";
import { courseSuspendedPath, lessonPath, paths } from "@/shared/config/routes";
import { ArrowRightIcon, LockIcon, Spinner } from "@/shared/ui";
import { CourseOutline } from "./CourseOutline";
import { LessonBreadcrumb } from "./LessonBreadcrumb";
import { CourseProgressCard } from "./CourseProgressCard";
import { LessonTranscript } from "./LessonTranscript";
import { LessonVideoCard } from "./LessonVideoCard";

export function LessonPage() {
  const { courseId = "", lessonId = "" } = useParams();
  const course = courses.find((item) => item.id === courseId);
  const { data: enrollment, isLoading } = useEnrollmentQuery(courseId);

  if (!course) return <Navigate to={paths.learning} replace />;

  const found = findLesson(course, lessonId);
  if (!found) return <Navigate to={paths.learning} replace />;

  if (isLoading || !enrollment) {
    return <Spinner label="Dars yuklanmoqda…" />;
  }

  const { lesson, module, moduleIndex } = found;
  const state = lessonStateOf(enrollment, lesson.id);

  // A suspended course keeps what the learner already finished: only the
  // lessons they had not reached yet close behind them.
  if (enrollment.status === "suspended" && state?.status !== "completed") {
    return <Navigate to={courseSuspendedPath(course.id)} replace />;
  }

  const progress = courseProgress(course, enrollment);

  const outline = (
    <div className="flex flex-col gap-4">
      <CourseProgressCard progress={progress} />
      <CourseOutline
        course={course}
        enrollment={enrollment}
        activeLessonId={lesson.id}
      />
    </div>
  );

  if (state?.status === "locked") {
    const open = enrollment.lessons.find((item) => item.status === "current");
    return (
      <div className="flex flex-col gap-4">
        <LessonBreadcrumb courseTitle={course.title} />
        <div className="grid gap-5 large:grid-cols-[minmax(0,1fr)_340px]">
          <section className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-card px-6 py-14 text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-brand-softer text-ink-muted">
              <LockIcon size={26} />
            </span>
            <h1 className="font-display text-2xl font-bold text-ink">
              Bu dars hali yopiq
            </h1>
            <p className="max-w-md text-ink-muted">
              {lockReason(course, enrollment, lesson.id) ??
                "Bu dars hali ochilmagan."}
            </p>
            {open ? (
              <Link
                to={lessonPath(course.id, open.lessonId)}
                className="mt-2 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-on-brand transition-colors hover:bg-brand-hover"
              >
                Ochiq darsga qaytish
                <ArrowRightIcon size={16} />
              </Link>
            ) : null}
          </section>
          {outline}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <LessonBreadcrumb courseTitle={course.title} />

      <div className="grid gap-5 large:grid-cols-[minmax(0,1fr)_340px] large:items-start">
        <div className="flex flex-col gap-5">
          <LessonVideoCard
            key={lesson.id}
            course={course}
            module={module}
            moduleIndex={moduleIndex}
            lesson={lesson}
            state={state}
            suspended={enrollment.status === "suspended"}
          />

          <LessonTranscript blocks={lesson.transcript} />
        </div>

        {outline}
      </div>
    </div>
  );
}
