import { useAuth } from '@/entities/user'

export function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-medium">Xush kelibsiz{user ? `, ${user.name}` : ''}!</h1>
      <p className="text-ink-muted">
        Bu — eduFlow ilovasining shaxsiy kabineti. FSD tuzilmasi va routing shu yerdan boshlanadi.
      </p>
    </div>
  )
}
