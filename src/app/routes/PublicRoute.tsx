import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/entities/user'
import { paths } from '@/shared/config/routes'

export function PublicRoute() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to={paths.courses} replace /> : <Outlet />
}
