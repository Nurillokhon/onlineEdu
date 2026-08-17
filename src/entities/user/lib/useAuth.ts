import { useAuthStore } from '../model/userStore'

export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const login = useAuthStore((state) => state.login)
  const logout = useAuthStore((state) => state.logout)
  const isAuthenticated = user !== null
  return { user, isAuthenticated, login, logout }
}
