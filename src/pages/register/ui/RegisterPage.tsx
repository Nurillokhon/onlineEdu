import { Link } from 'react-router-dom'
import { RegisterForm } from '@/features/auth/register-account'
import { paths } from '@/shared/config/routes'

export function RegisterPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-medium">Ro'yxatdan o'tish</h1>
      <RegisterForm />
      <p className="text-sm text-center">
        Akkountingiz bormi?{' '}
        <Link to={paths.login} className="text-brand font-medium">
          Kiring
        </Link>
      </p>
    </div>
  )
}
