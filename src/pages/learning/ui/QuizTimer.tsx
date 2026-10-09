/** @format */

import { useEffect, useRef, useState } from "react";
import { ClockIcon } from "@/shared/ui";

/** "14:59" from milliseconds remaining. */
function formatRemaining(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

/** Countdown to the attempt's deadline. Owns the ticking state, so only this
 * label re-renders every second and not the whole page. */
export function QuizTimer({
  deadline,
  onExpire,
}: {
  deadline: number;
  onExpire: () => void;
}) {
  const [remaining, setRemaining] = useState<number | null>(null);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  });

  useEffect(() => {
    function tick() {
      const left = deadline - Date.now();
      setRemaining(left);
      if (left <= 0) onExpireRef.current();
    }

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [deadline]);
  console.log("hello world");

  return (
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
  );
}
