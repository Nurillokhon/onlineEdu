import { Link } from 'react-router-dom'
import { paths } from '@/shared/config/routes'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-brand-softer text-ink">
      <h1 className="text-3xl font-medium">404</h1>
      <p>Sahifa topilmadi.</p>
      <Link to={paths.home} className="text-brand font-medium">
        Bosh sahifaga qaytish
      </Link>
    </div>
  )
}
