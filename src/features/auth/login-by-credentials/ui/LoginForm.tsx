import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  PhoneField,
  PasswordField,
  CaptchaField,
  Notice,
  ActionButton,
  LoginIcon,
  FingerprintIcon,
} from '@/shared/ui'
import { useAuth, useLoginMutation } from '@/entities/user'
import { paths } from '@/shared/config/routes'
import { isPhoneComplete, toApiPhone, useCaptcha } from '@/shared/lib'

const MAX_ATTEMPTS = 5
const LOCK_MS = 15 * 60 * 1000

export function LoginForm() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ phone?: string; password?: string; captcha?: string }>({})
  const [formError, setFormError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [lockedUntil, setLockedUntil] = useState(0)
  const [now, setNow] = useState(() => Date.now())

  const captcha = useCaptcha()
  const { login } = useAuth()
  const loginMutation = useLoginMutation()
  const navigate = useNavigate()

  const locked = lockedUntil > now
  const lockMinutesLeft = Math.max(1, Math.ceil((lockedUntil - now) / 60000))

  useEffect(() => {
    if (!locked) return
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [locked])

  function registerFailure(message: string) {
    const next = attempts + 1
    setAttempts(next)
    setFormError(message)
    captcha.refresh()
    if (next >= MAX_ATTEMPTS) {
      setLockedUntil(Date.now() + LOCK_MS)
      setNow(Date.now())
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (locked) return

    const nextErrors: typeof errors = {}
    if (!isPhoneComplete(phone)) nextErrors.phone = "Telefon raqamini to'liq kiriting."
    if (!password) nextErrors.password = 'Parolni kiriting.'
    setErrors(nextErrors)
    setFormError('')
    if (Object.keys(nextErrors).length > 0) return

    if (!captcha.isCorrect) {
      setErrors({ captcha: "Javob noto'g'ri." })
      registerFailure("CAPTCHA javobi noto'g'ri. Yangi misolni yeching.")
      return
    }

    loginMutation.mutate(
      { phone: toApiPhone(phone), password },
      {
        onSuccess: (user) => {
          login(user)
          navigate(paths.courses, { replace: true })
        },
        onError: () => {
          registerFailure("Telefon raqami yoki parol noto'g'ri.")
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <h1 className="font-display text-2xl font-bold text-brand text-center">Tizimga kirish</h1>

      <PhoneField value={phone} onChange={setPhone} errorText={errors.phone} />

      <PasswordField
        value={password}
        onChange={setPassword}
        errorText={errors.password}
        action={
          <Link to={paths.register} className="text-sm text-brand-hover hover:underline">
            Parolni unutdingizmi?
          </Link>
        }
      />

      <CaptchaField
        question={captcha.question}
        value={captcha.answer}
        onChange={captcha.setAnswer}
        onRefresh={captcha.refresh}
        errorText={errors.captcha}
      />

      {formError ? <Notice alert>{formError}</Notice> : null}

      <ActionButton
        type="submit"
        fullWidth
        disabled={loginMutation.isPending || locked}
        icon={locked || loginMutation.isPending ? undefined : <LoginIcon />}
        iconPosition="end"
      >
        {locked
          ? `Bloklandi — ${lockMinutesLeft} daqiqa`
          : loginMutation.isPending
            ? 'Kirilmoqda…'
            : 'Kirish'}
      </ActionButton>

      <div className="flex items-center gap-3 text-ink-muted text-sm">
        <span className="h-px flex-1 bg-line" />
        Yoki
        <span className="h-px flex-1 bg-line" />
      </div>

      <ActionButton
        variant="secondary"
        fullWidth
        icon={<FingerprintIcon />}
        // OneID is not wired up yet; say so instead of pretending to sign in.
        onClick={() => setFormError('OneID integratsiyasi hali ulanmagan.')}
      >
        OneID orqali kirish
      </ActionButton>

      <Notice>
        Xavfsizlik maqsadida {MAX_ATTEMPTS} marta noto'g'ri urinishdan so'ng hisob 15 daqiqaga
        bloklanadi.
      </Notice>

      <p className="text-sm text-center text-ink-muted">
        Akkountingiz yo'qmi?{' '}
        <Link to={paths.register} className="text-brand font-medium hover:underline">
          Ro'yxatdan o'ting
        </Link>
      </p>
    </form>
  )
}
