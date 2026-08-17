import { NavLink, Outlet } from 'react-router-dom'
import { LogoutButton } from '@/features/auth/logout'
import { useAuth } from '@/entities/user'
import { paths } from '@/shared/config/routes'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-full text-sm ${isActive ? 'bg-brand text-on-brand' : 'text-ink-muted hover:text-ink'}`

export function Navbar() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-brand-softer text-ink">
      <nav className="flex items-center justify-between px-6 py-3 bg-surface border-b border-line">
        <span className="text-lg font-medium">eduFlow</span>
        <div className="flex items-center gap-2">
          <NavLink to={paths.dashboard} end className={linkClass}>
            Bosh sahifa
          </NavLink>
          <NavLink to={paths.profile} className={linkClass}>
            Profil
          </NavLink>
          {user ? <span className="px-2 text-sm opacity-70">{user.name}</span> : null}
          <LogoutButton />
        </div>
      </nav>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  )
}
