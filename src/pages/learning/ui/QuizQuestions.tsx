/** @format */

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAnswerQuestionMutation,
  useSubmitAttemptMutation,
  type Quiz,
} from "@/entities/enrollment";
import { quizResultPath } from "@/shared/config/routes";
import { ArrowRightIcon } from "@/shared/ui";
import { QuizHeading } from "./QuizHeading";
import { QuizTimer } from "./QuizTimer";

/**
 * A running attempt: one question at a time, with no way back. It owns the
 * answer and submit mutations, so their pending states re-render this block
 * and not the page around it.
 */
export function QuizQuestions({
  courseId,
  quizId,
  quiz,
  deadline,
}: {
  courseId: string;
  quizId: string;
  quiz: Quiz;
  deadline: number;
}) {
  const navigate = useNavigate();
  const answerQuestion = useAnswerQuestionMutation();
  const submitAttempt = useSubmitAttemptMutation();

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const submittedRef = useRef(false);

  const question = quiz.questions[index];
  const isLast = index === quiz.questions.length - 1;

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
    <div className="flex flex-col gap-5 p-6">
      <QuizHeading title={quiz.title} />

      <div className="flex items-center justify-between gap-4">
        <span className="rounded-lg bg-brand-softer px-3 py-1.5 text-sm font-medium text-brand">
          Savol {index + 1} / {quiz.questions.length}
        </span>
        <QuizTimer deadline={deadline} onExpire={finish} />
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
  );
}
