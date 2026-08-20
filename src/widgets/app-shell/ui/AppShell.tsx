/** @format */

import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/entities/user";
import { paths } from "@/shared/config/routes";
import { Sidebar } from "./Sidebar";

/**
 * The signed-in shell. Navigation lives entirely in the rail on the start
 * edge: it sits inline once there is room for it, and slides over the content
 * as a modal drawer on narrow windows.
 */
export function AppShell() {
  const [expanded, setExpanded] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!expanded) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [expanded]);

  function handleLogout() {
    logout();
    queryClient.clear();
    navigate(paths.login, { replace: true });
  }

  return (
    <div className="min-h-screen flex bg-surface text-ink">
      <div className="hidden medium:block shrink-0 sticky top-0 h-screen">
        <Sidebar
          expanded={expanded}
          onToggle={() => setExpanded((open) => !open)}
          onNavigate={() => undefined}
          onLogout={handleLogout}
        />
      </div>

      {/* Compact: the rail is collapsed and the menu opens it over the page. */}
      <div className="medium:hidden shrink-0 sticky top-0 h-screen">
        <Sidebar
          expanded={false}
          onToggle={() => setExpanded(true)}
          onNavigate={() => undefined}
          onLogout={handleLogout}
        />
      </div>

      {expanded ? (
        <div className="medium:hidden fixed inset-0 z-20 flex">
          <div className="h-full">
            <Sidebar
              expanded
              onToggle={() => setExpanded(false)}
              onNavigate={() => setExpanded(false)}
              onLogout={handleLogout}
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

      <main className="flex-1 min-w-0  mt-3  sm:mt-4 rounded-tl-2xl border border-line bg-brand-softer p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
}
