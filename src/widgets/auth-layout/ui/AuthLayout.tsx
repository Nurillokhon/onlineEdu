import { Outlet } from 'react-router-dom'
import { Card } from '@/shared/ui'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-softer p-4">
      <div className="w-full max-w-sm">
        <Card>
          <Outlet />
        </Card>
      </div>
    </div>
  )
}
