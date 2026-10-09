/** @format */

import { Link } from "react-router-dom";
import { paths } from "@/shared/config/routes";
import { AlertIcon } from "@/shared/ui";

/** Shown when the server refuses access to the quiz, with its reason. */
export function QuizLocked({ reason }: { reason: string | null }) {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-danger-soft text-danger">
        <AlertIcon size={26} />
      </span>
      <h1 className="font-display text-2xl font-bold text-ink">
        Test hozircha ochilmaydi
      </h1>
      <p className="max-w-md text-ink-muted">{reason}</p>
      <Link
        to={paths.learning}
        className="mt-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-on-brand transition-colors hover:bg-brand-hover"
      >
        O'qishga qaytish
      </Link>
    </div>
  );
}
