import { Link } from 'react-router-dom'
import { LoginForm } from '@/features/auth/login-by-credentials'
import { paths } from '@/shared/config/routes'

export function LoginPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-medium">Kirish</h1>
      <LoginForm />
      <p className="text-sm text-center">
        Akkountingiz yo'qmi?{' '}
        <Link to={paths.register} className="text-brand font-medium">
          Ro'yxatdan o'ting
        </Link>
      </p>
    </div>
  )
}
