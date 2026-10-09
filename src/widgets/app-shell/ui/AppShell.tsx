/** @format */

import { Outlet } from "react-router-dom";
import { ShellNavigation } from "./ShellNavigation";

/**
 * The signed-in shell. Navigation lives entirely in the rail on the start
 * edge: it sits inline once there is room for it, and slides over the content
 * as a modal drawer on narrow windows.
 *
 * It holds no state and reads nothing from the router on purpose, so neither
 * opening the menu nor changing route re-renders it.
 */
export function AppShell() {
  return (
    <div className="min-h-screen flex bg-surface text-ink">
      <ShellNavigation />

      <main className="flex-1 min-w-0  mt-3  sm:mt-4 rounded-tl-2xl border border-line bg-brand-softer p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
}
