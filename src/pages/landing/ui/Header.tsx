import { Link } from 'react-router-dom'
import { paths } from '@/shared/config/routes'
import { BellIcon, HelpIcon } from './icons'
import { containerClass } from './container'

export function Header() {
  return (
    <header className="border-b border-line">
      <div className={`${containerClass} py-4 flex items-center justify-between`}>
        <span className="text-xl font-bold text-ink">EduFlow</span>

        <nav className="hidden sm:flex items-center gap-8">
          <a href="#jarayon" className="text-sm font-medium text-ink border-b-2 border-brand pb-1">
            Online Darslar
          </a>
          <a href="#mentorlar" className="text-sm font-medium text-ink-muted hover:text-ink">
            Biz Haqimizda
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Bildirishnomalar"
            className="w-9 h-9 rounded-full flex items-center justify-center text-ink-muted hover:bg-brand-softer hover:text-ink"
          >
            <BellIcon />
          </button>
          <button
            type="button"
            aria-label="Yordam"
            className="w-9 h-9 rounded-full flex items-center justify-center text-ink-muted hover:bg-brand-softer hover:text-ink"
          >
            <HelpIcon />
          </button>
          <Link
            to={paths.login}
            className="px-4 py-2 rounded-full text-sm font-medium bg-brand-soft text-brand hover:bg-brand hover:text-on-brand transition-colors"
          >
            Kirish
          </Link>
        </div>
      </div>
    </header>
  )
}
