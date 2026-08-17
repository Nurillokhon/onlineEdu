import { containerClass } from './container'

export function Footer() {
  return (
    <footer
      className={`${containerClass} mt-20 py-8 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-ink-muted`}
    >
      <span className="text-ink font-bold">EduFlow</span>
      <p>© 2024 Nomzod Platformasi. Barcha huquqlar himoyalangan. Agentlik brendi.</p>
      <div className="flex items-center gap-4">
        <a href="#" className="hover:text-ink">
          Maxfiylik siyosati
        </a>
        <a href="#" className="hover:text-ink">
          Foydalanish shartlari
        </a>
        <a href="#" className="hover:text-ink">
          Yordam markazi
        </a>
      </div>
    </footer>
  )
}
