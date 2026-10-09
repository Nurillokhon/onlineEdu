/** @format */

import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/entities/user";
import { paths } from "@/shared/config/routes";
import { LogoutIcon } from "@/shared/ui";

/**
 * Signs the learner out. `useNavigate` subscribes to the router, so it is kept
 * in this leaf: a route change re-renders one button rather than the shell.
 */
export function LogoutButton({ expanded }: { expanded: boolean }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  function handleLogout() {
    logout();
    queryClient.clear();
    navigate(paths.login, { replace: true });
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`rounded-full text-ink-muted hover:bg-brand-softer hover:text-ink transition-colors ${
        expanded
          ? "h-12 px-4 flex items-center gap-3 text-sm"
          : "h-12 flex items-center justify-center"
      }`}
    >
      <LogoutIcon size={20} />
      {expanded ? "Chiqish" : null}
    </button>
  );
}
