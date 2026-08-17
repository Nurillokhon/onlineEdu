import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/entities/user'
import { paths } from '@/shared/config/routes'

export function PrivateRoute() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Outlet /> : <Navigate to={paths.login} replace />
}
