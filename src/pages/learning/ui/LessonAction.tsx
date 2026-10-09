/** @format */

import { Link } from "react-router-dom";
import { WATCHED_THRESHOLD } from "@/entities/enrollment";
import { lessonPath, quizPath } from "@/shared/config/routes";
import { ArrowRightIcon } from "@/shared/ui";
import { useWatchProgress, type WatchProgress } from "../lib/watchProgress";

interface LessonActionProps {
  courseId: string;
  quizId: string;
  /** True once the server has accepted the lesson video as watched. */
  videoCompleted: boolean;
  quizPassed: boolean;
  nextLessonId: string | null;
  examId: string;
  progress: WatchProgress;
}

/**
 * The one control that moves the learner forward. It shows the single next
 * step rather than a row of buttons, and says why when it cannot be pressed —
 * a dead button with no explanation reads as a bug.
 */
export function LessonAction({
  courseId,
  quizId,
  videoCompleted,
  quizPassed,
  nextLessonId,
  examId,
  progress,
}: LessonActionProps) {
  // Local reading of the gate, so the button opens the moment the learner
  // reaches the end rather than after the next autosave round-trip.
  const reached = useWatchProgress(
    progress,
    (fraction) => fraction >= WATCHED_THRESHOLD,
  );
  const videoReady = videoCompleted || reached;
  const buttonClass =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-on-brand transition-colors hover:bg-brand-hover";

  if (!videoReady) {
    return (
      <div className="flex flex-col items-end gap-1.5">
        <button
          type="button"
          disabled
          className={`${buttonClass} cursor-not-allowed opacity-45`}
        >
          Testni boshlash
          <ArrowRightIcon size={16} />
        </button>
        <p className="text-xs text-ink-muted">
          Videoni oxirigacha ko'ring (<WatchedPercent progress={progress} /> /{" "}
          {Math.round(WATCHED_THRESHOLD * 100)}%)
        </p>
      </div>
    );
  }

  if (!quizPassed) {
    return (
      <div className="flex flex-col items-end gap-1.5">
        <Link to={quizPath(courseId, quizId)} className={buttonClass}>
          Testni boshlash
          <ArrowRightIcon size={16} />
        </Link>
        <p className="text-xs text-ink-muted">Test keyingi darsni ochadi</p>
      </div>
    );
  }

  return (
    <Link
      to={
        nextLessonId
          ? lessonPath(courseId, nextLessonId)
          : quizPath(courseId, examId)
      }
      className={buttonClass}
    >
      {nextLessonId ? "Keyingi dars" : "Modul nazoratiga o‘tish"}
      <ArrowRightIcon size={16} />
    </Link>
  );
}

/** The live "42%" in the hint, on its own so a new percent re-renders only
 * this text and not the button around it. */
function WatchedPercent({ progress }: { progress: WatchProgress }) {
  const percent = useWatchProgress(progress, (fraction) =>
    Math.round(Math.max(fraction, 0) * 100),
  );
  return <>{percent}%</>;
}
