/** @format */

import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { courses } from "@/entities/course";
import {
  EXAM_ATTEMPTS,
  useAnswerQuestionMutation,
  useEnrollmentQuery,
  useQuizAccessQuery,
  useQuizAttemptQuery,
  useQuizQuery,
  useStartAttemptMutation,
  useSubmitAttemptMutation,
} from "@/entities/enrollment";
import {
  courseSuspendedPath,
  paths,
  quizResultPath,
} from "@/shared/config/routes";
import {
  AlertIcon,
  ArrowRightIcon,
  ClockIcon,
  DocumentFilledIcon,
  Spinner,
} from "@/shared/ui";
import { CourseOutline } from "./CourseOutline";
import { LessonBreadcrumb } from "./LessonBreadcrumb";

/** "14:59" from milliseconds remaining. */
function formatRemaining(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

export function QuizPage() {
  const { courseId = "", quizId = "" } = useParams();
  const navigate = useNavigate();
  const course = courses.find((item) => item.id === courseId);

  const { data: enrollment } = useEnrollmentQuery(courseId);
  const { data: access, isLoading: accessLoading } = useQuizAccessQuery(
    courseId,
    quizId,
  );
  const { data: quiz, isLoading: quizLoading } = useQuizQuery(courseId, quizId);
  const { data: attempt, isLoading: attemptLoading } = useQuizAttemptQuery(
    courseId,
    quizId,
  );

  const startAttempt = useStartAttemptMutation();
  const answerQuestion = useAnswerQuestionMutation();
  const submitAttempt = useSubmitAttemptMutation();

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const submittedRef = useRef(false);

  const running = attempt && attempt.submittedAt === null ? attempt : null;

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

  function finish() {
    if (submittedRef.current) return;
    submittedRef.current = true;
    submitAttempt.mutate(
      { courseId, quizId },
      {
        onSuccess: () =>
          navigate(quizResultPath(courseId, quizId), { replace: true }),
      },
    );
  }

  useEffect(() => {
    if (!running) return;

    function tick() {
      const left =
        (running as NonNullable<typeof running>).deadline - Date.now();
      setRemaining(left);
      // Time is the server's deadline, not a counter the page owns: coming back
      // late means the attempt is already over.
      if (left <= 0) finish();
    }

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running?.deadline]);

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
        <div className="flex flex-col items-center gap-4 px-6 py-14 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-danger-soft text-danger">
            <AlertIcon size={26} />
          </span>
          <h1 className="font-display text-2xl font-bold text-ink">
            Test hozircha ochilmaydi
          </h1>
          <p className="max-w-md text-ink-muted">{access.reason}</p>
          <Link
            to={paths.learning}
            className="mt-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-on-brand transition-colors hover:bg-brand-hover"
          >
            O'qishga qaytish
          </Link>
        </div>
      </QuizShell>
    );
  }

  if (!running) {
    const used = quiz.attemptsUsed;
    const left =
      quiz.attemptsAllowed === null
        ? null
        : Math.max(0, quiz.attemptsAllowed - used);

    return (
      <QuizShell {...shellProps}>
        <div className="flex flex-col gap-5 p-6">
          <div className="flex flex-col gap-2">
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.12em] text-ink-muted uppercase">
              <DocumentFilledIcon size={14} />
              Test topshirig'i
            </p>
            <h1 className="font-display text-2xl font-bold text-ink">
              {quiz.title}
            </h1>
          </div>

          <dl className="grid gap-3 medium:grid-cols-3">
            {[
              { label: "Savollar", value: `${quiz.questions.length} ta` },
              {
                label: "Vaqt",
                value: `${Math.round(quiz.timeLimit / 60)} daqiqa`,
              },
              { label: "O'tish balli", value: `${quiz.passScore}%` },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl bg-brand-softer px-4 py-3"
              >
                <dt className="text-sm text-ink-muted">{item.label}</dt>
                <dd className="font-semibold text-ink">{item.value}</dd>
              </div>
            ))}
          </dl>

          {left === null ? null : (
            <p className="flex items-start gap-2 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
              <AlertIcon size={16} />
              <span>
                {EXAM_ATTEMPTS} tadan {used + 1}-urinish. Testni
                boshlaganingizdan keyin urinish hisoblanadi — sahifani yopsangiz
                ham qaytarilmaydi. Sizda {left} ta urinish qoldi.
              </span>
            </p>
          )}

          <button
            type="button"
            onClick={() => startAttempt.mutate({ courseId, quizId })}
            disabled={startAttempt.isPending}
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-on-brand transition-colors hover:bg-brand-hover disabled:opacity-50"
          >
            {startAttempt.isPending ? "Boshlanmoqda…" : "Testni boshlash"}
            <ArrowRightIcon size={16} />
          </button>
        </div>
      </QuizShell>
    );
  }

  const question = quiz.questions[index];
  const isLast = index === quiz.questions.length - 1;

  function submitAnswer() {
    if (!selected || !question) return;
    answerQuestion.mutate({
      courseId,
      quizId,
      questionId: question.id,
      optionId: selected,
    });
    setSelected(null);
    if (isLast) {
      finish();
      return;
    }
    setIndex((current) => current + 1);
  }

  return (
    <QuizShell {...shellProps}>
      <div className="flex flex-col gap-5 p-6">
        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.12em] text-ink-muted uppercase">
            <DocumentFilledIcon size={14} />
            Test topshirig'i
          </p>
          <h1 className="font-display text-2xl font-bold text-ink">
            {quiz.title}
          </h1>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="rounded-lg bg-brand-softer px-3 py-1.5 text-sm font-medium text-brand">
            Savol {index + 1} / {quiz.questions.length}
          </span>
          <span
            role="timer"
            className={`flex items-center gap-1.5 text-sm tabular-nums ${
              remaining !== null && remaining < 60_000
                ? "text-danger"
                : "text-ink-muted"
            }`}
          >
            <ClockIcon size={15} />
            {remaining === null ? "—" : formatRemaining(remaining)}
          </span>
        </div>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 text-lg text-ink">{question?.text}</legend>
          {question?.options.map((option) => (
            <label
              key={option.id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 transition-colors ${
                selected === option.id
                  ? "border-brand bg-brand-softer"
                  : "border-line hover:bg-brand-softer/50"
              }`}
            >
              <input
                type="radio"
                name={question.id}
                value={option.id}
                checked={selected === option.id}
                onChange={() => setSelected(option.id)}
                className="size-4 accent-brand"
              />
              <span className="text-ink">{option.text}</span>
            </label>
          ))}
        </fieldset>

        <div className="flex justify-end border-t border-line pt-4">
          <button
            type="button"
            onClick={submitAnswer}
            disabled={!selected || submitAttempt.isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-on-brand transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-45"
          >
            {isLast ? "Testni yakunlash" : "Javobni yuborish"}
            <ArrowRightIcon size={16} />
          </button>
        </div>

        <p className="text-xs text-ink-muted">
          Javob yuborilgandan keyin savolga qaytib bo'lmaydi. Natija test
          yakunida ko'rsatiladi.
        </p>
      </div>
    </QuizShell>
  );
}

/** Shared two-column frame, so every quiz state keeps the outline in place. */
function QuizShell({
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
