/** @format */

import { NavLink } from "react-router-dom";
import { GraduationCapIcon } from "@/shared/ui";
import { destinations } from "./navigation";

/**
 * Material 3 navigation rail — the medium window size class (600–1199px).
 * Material Web ships no rail component, so it follows the spec directly:
 * 80dp wide, a 56×32 active indicator above a label.
 */
export function NavigationRail() {
  return (
    <nav
      aria-label="Asosiy navigatsiya"
      className="hidden medium:flex large:hidden w-20 shrink-0 flex-col items-center gap-3 py-4 bg-surface border-r border-line"
    >
      <span className="w-12 h-12 rounded-2xl bg-brand text-on-brand flex items-center justify-center mb-2">
        <GraduationCapIcon size={24} />
      </span>
      {destinations.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className="flex flex-col items-center gap-1 w-full group"
          aria-label={item.label}
        >
          {({ isActive }) => (
            <>
              <span
                className={`w-14 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isActive
                    ? "bg-brand-soft text-brand"
                    : "text-ink-muted group-hover:bg-brand-softer"
                }`}
              >
                {item.icon(22)}
              </span>
              <span
                className={`text-[11px] leading-tight text-center ${
                  isActive ? "text-ink font-medium" : "text-ink-muted"
                }`}
              >
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
