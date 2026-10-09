/** @format */

import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { courses } from "@/entities/course";
import {
  useAttemptDeadlineQuery,
  useEnrollmentQuery,
  useQuizAccessQuery,
  useQuizQuery,
  useStartAttemptMutation,
} from "@/entities/enrollment";
import { courseSuspendedPath, paths } from "@/shared/config/routes";
import { Spinner } from "@/shared/ui";
import { CourseOutline } from "./CourseOutline";
import { QuizIntro } from "./QuizIntro";
import { QuizLocked } from "./QuizLocked";
import { QuizQuestions } from "./QuizQuestions";
import { QuizShell } from "./QuizShell";

export function QuizPage() {
  const { courseId = "", quizId = "" } = useParams();
  const course = courses.find((item) => item.id === courseId);

  const { data: enrollment } = useEnrollmentQuery(courseId);
  const { data: access, isLoading: accessLoading } = useQuizAccessQuery(
    courseId,
    quizId,
  );
  const { data: quiz, isLoading: quizLoading } = useQuizQuery(courseId, quizId);
  // The page reads only the deadline, and the answer and submit mutations live
  // in QuizQuestions: sending an answer re-renders the question, not the page.
  const { data: deadline = null, isLoading: attemptLoading } =
    useAttemptDeadlineQuery(courseId, quizId);

  const startAttempt = useStartAttemptMutation();

  const running = deadline !== null;

  // A lesson quiz has no attempt limit, so opening the page is the intent to
  // start. An exam costs one of three attempts and asks first.
  const autoStart =
    Boolean(quiz) &&
    quiz?.attemptsAllowed === null &&
    !running &&
    access?.allowed === true;

  useEffect(() => {
    if (!autoStart || startAttempt.isPending) return;
    startAttempt.mutate({ courseId, quizId });
  }, [autoStart, courseId, quizId, startAttempt]);

  if (!course) return <Navigate to={paths.learning} replace />;
  if (enrollment?.status === "suspended") {
    return <Navigate to={courseSuspendedPath(courseId)} replace />;
  }
  if (accessLoading || quizLoading || attemptLoading || !quiz) {
    return <Spinner label="Test yuklanmoqda…" />;
  }

  const outline = (
    <CourseOutline
      course={course}
      enrollment={enrollment}
      activeQuizId={quizId}
    />
  );
  const shellProps = { outline, courseTitle: course.title };

  if (access && !access.allowed) {
    return (
      <QuizShell {...shellProps}>
        <QuizLocked reason={access.reason} />
      </QuizShell>
    );
  }

  if (deadline === null) {
    return (
      <QuizShell {...shellProps}>
        <QuizIntro
          quiz={quiz}
          starting={startAttempt.isPending}
          onStart={() => startAttempt.mutate({ courseId, quizId })}
        />
      </QuizShell>
    );
  }

  return (
    <QuizShell {...shellProps}>
      <QuizQuestions
        courseId={courseId}
        quizId={quizId}
        quiz={quiz}
        deadline={deadline}
      />
    </QuizShell>
  );
}
