/** @format */

import { EXAM_ATTEMPTS, type Quiz } from "@/entities/enrollment";
import { AlertIcon, ArrowRightIcon } from "@/shared/ui";
import { QuizHeading } from "./QuizHeading";

/** The screen before an attempt: what the quiz costs and the start button. */
export function QuizIntro({
  quiz,
  starting,
  onStart,
}: {
  quiz: Quiz;
  starting: boolean;
  onStart: () => void;
}) {
  const used = quiz.attemptsUsed;
  const left =
    quiz.attemptsAllowed === null
      ? null
      : Math.max(0, quiz.attemptsAllowed - used);

  return (
    <div className="flex flex-col gap-5 p-6">
      <QuizHeading title={quiz.title} />

      <dl className="grid gap-3 medium:grid-cols-3">
        {[
          { label: "Savollar", value: `${quiz.questions.length} ta` },
          {
            label: "Vaqt",
            value: `${Math.round(quiz.timeLimit / 60)} daqiqa`,
          },
          { label: "O'tish balli", value: `${quiz.passScore}%` },
        ].map((item) => (
          <div key={item.label} className="rounded-xl bg-brand-softer px-4 py-3">
            <dt className="text-sm text-ink-muted">{item.label}</dt>
            <dd className="font-semibold text-ink">{item.value}</dd>
          </div>
        ))}
      </dl>

      {left === null ? null : (
        <p className="flex items-start gap-2 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
          <AlertIcon size={16} />
          <span>
            {EXAM_ATTEMPTS} tadan {used + 1}-urinish. Testni boshlaganingizdan
            keyin urinish hisoblanadi — sahifani yopsangiz ham qaytarilmaydi.
            Sizda {left} ta urinish qoldi.
          </span>
        </p>
      )}

      <button
        type="button"
        onClick={onStart}
        disabled={starting}
        className="inline-flex w-fit items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-on-brand transition-colors hover:bg-brand-hover disabled:opacity-50"
      >
        {starting ? "Boshlanmoqda…" : "Testni boshlash"}
        <ArrowRightIcon size={16} />
      </button>
    </div>
  );
}
