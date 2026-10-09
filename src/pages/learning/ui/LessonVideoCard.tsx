/** @format */

import { useCallback, useState } from "react";
import type { Course, CurriculumModule, Lesson } from "@/entities/course";
import {
  useSaveWatchedMutation,
  type LessonState,
} from "@/entities/enrollment";
import { AlertIcon, CheckCircleIcon, RefreshIcon } from "@/shared/ui";
import { useSaveIndicator } from "../lib/useSaveIndicator";
import { createWatchProgress } from "../lib/watchProgress";
import { LessonAction } from "./LessonAction";
import { LessonPlayer } from "./LessonPlayer";

interface LessonVideoCardProps {
  course: Course;
  module: CurriculumModule;
  moduleIndex: number;
  lesson: Lesson;
  state: LessonState | undefined;
  /** A suspended course leaves finished lessons open, but read-only. */
  suspended: boolean;
}

/**
 * The player with the lesson title and the way forward under it. Autosave
 * flips every few seconds, so it lives here rather than on the page: the
 * outline and transcript stay out of it.
 */
export function LessonVideoCard({
  course,
  module,
  moduleIndex,
  lesson,
  state,
  suspended,
}: LessonVideoCardProps) {
  const { mutate, isPending } = useSaveWatchedMutation();
  const saveStatus = useSaveIndicator(isPending);
  // Handed from the player to the action below without passing through this
  // component's state, so a second of playback does not re-render the card.
  const [progress] = useState(createWatchProgress);

  const courseId = course.id;
  const lessonId = lesson.id;
  const onSave = useCallback(
    (payload: { watchedSeconds: number; duration: number }) =>
      mutate({ courseId, lessonId, ...payload }),
    [mutate, courseId, lessonId],
  );

  const lessonIndex = module.lessons.findIndex((item) => item.id === lesson.id);
  const nextLesson = module.lessons[lessonIndex + 1] ?? null;
  const videoCompleted = Boolean(state?.videoCompleted);

  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-card">
      <LessonPlayer
        lesson={lesson}
        poster={course.cover}
        watchedSeconds={state?.watchedSeconds ?? 0}
        completed={videoCompleted}
        onSave={onSave}
        onFractionChange={progress.set}
      />

      <div className="flex flex-col gap-3 p-5">
        <div className="flex min-h-5 items-center gap-2 text-xs">
          {saveStatus === "saving" ? (
            <span className="flex items-center gap-1.5 text-ink-muted">
              <RefreshIcon size={13} />
              Progress saqlanmoqda...
            </span>
          ) : saveStatus === "saved" ? (
            <span className="flex items-center gap-1.5 text-brand-hover">
              <CheckCircleIcon size={13} />
              Saqlandi
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-2">
            <span className="w-fit rounded-lg bg-brand-softer px-2.5 py-1 text-xs font-medium text-brand">
              {moduleIndex + 1}-Modul, {lessonIndex + 1}-Dars
            </span>
            <h1 className="font-display text-2xl font-bold text-ink">
              {lesson.number} {lesson.title}
            </h1>
          </div>

          {suspended ? (
            // Read-only: offering a way forward would only lead back to
            // the suspension screen.
            <p className="flex items-center gap-2 rounded-xl bg-danger-soft px-4 py-2.5 text-sm text-danger">
              <AlertIcon size={16} />
              Kurs to'xtatilgan — bu dars faqat ko'rish uchun ochiq
            </p>
          ) : (
            <LessonAction
              courseId={course.id}
              quizId={lesson.quizId}
              videoCompleted={videoCompleted}
              quizPassed={Boolean(state?.quizPassed)}
              nextLessonId={nextLesson?.id ?? null}
              examId={module.examId}
              progress={progress}
            />
          )}
        </div>
      </div>
    </article>
  );
}
