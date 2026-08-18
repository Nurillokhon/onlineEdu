import { Outlet } from 'react-router-dom'
import { GraduationCapIcon } from '@/shared/ui'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-brand-softer flex flex-col items-center justify-center gap-6 px-4 py-10">
      <div className="flex flex-col items-center gap-3">
        <span className="w-14 h-14 rounded-2xl bg-brand text-on-brand flex items-center justify-center">
          <GraduationCapIcon size={28} />
        </span>
        <div className="text-center">
          <p className="font-display text-3xl font-bold text-brand">EduFlow</p>
          <p className="text-ink-muted text-sm mt-1">Nomzod Platformasi</p>
        </div>
      </div>

      <div className="w-full max-w-xl bg-surface border border-line rounded-2xl shadow-sm p-6 sm:p-8">
        <Outlet />
      </div>

      <p className="text-ink-muted text-xs">
        © 2024 EduFlow. Barcha huquqlar himoyalangan.
      </p>
    </div>
  )
}
