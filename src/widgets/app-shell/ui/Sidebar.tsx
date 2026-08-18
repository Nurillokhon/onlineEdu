import { NavLink } from 'react-router-dom'
import { MdFab } from '@/shared/ui/material/fab'
import { MdIconButton } from '@/shared/ui/material/icon-button'
import { MenuIcon, PlayIcon, LogoutIcon } from '@/shared/ui'
import { useAuth } from '@/entities/user'
import { destinations } from './navigation'

interface SidebarProps {
  expanded: boolean
  onToggle: () => void
  /** Called after a destination is picked, so the overlay can close itself. */
  onNavigate: () => void
  onPrimaryAction: () => void
  onLogout: () => void
}

/**
 * Material 3 navigation rail: a menu button, the screen's primary action as a
 * FAB, then the destinations. Toggling the menu expands the rail into a drawer
 * — the only navigation surface in the app, so it also carries the account row.
 */
export function Sidebar({
  expanded,
  onToggle,
  onNavigate,
  onPrimaryAction,
  onLogout,
}: SidebarProps) {
  const { user } = useAuth()

  return (
    <div
      className={`h-full flex flex-col bg-surface transition-[width] duration-200 ${
        expanded ? 'w-[260px] items-stretch px-3' : 'w-[72px] medium:w-20 items-center px-2'
      } py-4 gap-2`}
    >
      <div className={`flex items-center ${expanded ? 'justify-between px-1' : 'justify-center'}`}>
        <MdIconButton
          onClick={onToggle}
          aria-label={expanded ? 'Menyuni yig\'ish' : 'Menyuni ochish'}
          aria-expanded={expanded}
        >
          <MenuIcon />
        </MdIconButton>
        {expanded ? (
          <span className="font-display text-lg font-bold text-brand">EduFlow</span>
        ) : null}
      </div>

      <div className={`${expanded ? 'px-1' : ''} mt-2 mb-4`}>
        <MdFab
          size="medium"
          label={expanded ? 'Davom etish' : undefined}
          aria-label="Kursni davom ettirish"
          onClick={onPrimaryAction}
        >
          <span slot="icon" className="flex">
            <PlayIcon size={20} />
          </span>
        </MdFab>
      </div>

      <nav aria-label="Asosiy navigatsiya" className="flex flex-col gap-1">
        {destinations.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            aria-label={item.label}
            className={expanded ? 'block' : 'flex flex-col items-center gap-1'}
          >
            {({ isActive }) =>
              expanded ? (
                <span
                  className={`h-14 px-4 rounded-full flex items-center gap-3 text-sm transition-colors ${
                    isActive
                      ? 'bg-brand-soft text-brand font-medium'
                      : 'text-ink-muted hover:bg-brand-softer hover:text-ink'
                  }`}
                >
                  {item.icon(22)}
                  {item.label}
                </span>
              ) : (
                <>
                  <span
                    className={`w-14 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isActive ? 'bg-brand-soft text-brand' : 'text-ink-muted hover:bg-brand-softer'
                    }`}
                  >
                    {item.icon(22)}
                  </span>
                  <span
                    className={`text-[11px] leading-tight text-center ${
                      isActive ? 'text-ink font-medium' : 'text-ink-muted'
                    }`}
                  >
                    {item.label}
                  </span>
                </>
              )
            }
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-2">
        <div
          className={`flex items-center gap-3 ${expanded ? 'px-2' : 'justify-center'}`}
          title={user?.name}
        >
          <span className="w-9 h-9 shrink-0 rounded-full bg-brand-soft text-brand text-xs font-semibold flex items-center justify-center">
            {(user?.name ?? 'EF').slice(0, 2).toUpperCase()}
          </span>
          {expanded ? (
            <span className="text-sm text-ink truncate">{user?.name}</span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onLogout}
          className={`rounded-full text-ink-muted hover:bg-brand-softer hover:text-ink transition-colors ${
            expanded ? 'h-12 px-4 flex items-center gap-3 text-sm' : 'h-12 flex items-center justify-center'
          }`}
        >
          <LogoutIcon size={20} />
          {expanded ? 'Chiqish' : null}
        </button>
      </div>
    </div>
  )
}
