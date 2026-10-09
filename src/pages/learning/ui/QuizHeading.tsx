/** @format */

import { DocumentFilledIcon } from "@/shared/ui";

/** The "Test topshirig'i" eyebrow and the quiz title, shared by the start
 * screen and the running attempt. */
export function QuizHeading({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.12em] text-ink-muted uppercase">
        <DocumentFilledIcon size={14} />
        Test topshirig'i
      </p>
      <h1 className="font-display text-2xl font-bold text-ink">{title}</h1>
    </div>
  );
}
