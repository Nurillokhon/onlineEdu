import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/shared/ui'
import { useAuth } from '@/entities/user'
import { paths } from '@/shared/config/routes'

export function LogoutButton() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  function handleLogout() {
    logout()
    // Prevent cross-user data-bleed: cached query results (e.g. profile stats)
    // are not scoped per-user, so the next user to log in must not see them.
    queryClient.clear()
    navigate(paths.login, { replace: true })
  }

  return (
    <Button variant="text" onClick={handleLogout}>
      Chiqish
    </Button>
  )
}
