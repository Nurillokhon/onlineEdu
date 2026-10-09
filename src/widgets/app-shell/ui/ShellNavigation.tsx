/** @format */

import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";

/**
 * The rail in each of its placements: inline once there is room for it, and a
 * modal drawer over the content on narrow windows. It owns the open state, so
 * toggling the menu re-renders the navigation and leaves the page alone.
 */
export function ShellNavigation() {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [expanded]);

  return (
    <>
      <div className="hidden medium:block shrink-0 sticky top-0 h-screen">
        <Sidebar
          expanded={expanded}
          onToggle={() => setExpanded((open) => !open)}
          onNavigate={() => undefined}
        />
      </div>

      {/* Compact: the rail is collapsed and the menu opens it over the page. */}
      <div className="medium:hidden shrink-0 sticky top-0 h-screen">
        <Sidebar
          expanded={false}
          onToggle={() => setExpanded(true)}
          onNavigate={() => undefined}
        />
      </div>

      {expanded ? (
        <div className="medium:hidden fixed inset-0 z-20 flex">
          <div className="h-full">
            <Sidebar
              expanded
              onToggle={() => setExpanded(false)}
              onNavigate={() => setExpanded(false)}
            />
          </div>
          <button
            type="button"
            aria-label="Menyuni yopish"
            onClick={() => setExpanded(false)}
            className="flex-1 bg-ink/30"
          />
        </div>
      ) : null}
    </>
  );
}
