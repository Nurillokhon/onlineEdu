import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@/shared/ui'
import { useAuth, useRegisterMutation } from '@/entities/user'
import { paths } from '@/shared/config/routes'

export function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const registerMutation = useRegisterMutation()
  const navigate = useNavigate()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    registerMutation.mutate(
      { name, email, password },
      {
        onSuccess: (user) => {
          login(user)
          navigate(paths.dashboard, { replace: true })
        },
        onError: () => {
          setError("Xatolik yuz berdi, qayta urinib ko'ring.")
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextField label="Ism" value={name} onChange={setName} required />
      <TextField label="Email" type="email" value={email} onChange={setEmail} required />
      <TextField
        label="Parol"
        type="password"
        value={password}
        onChange={setPassword}
        required
        errorText={error}
      />
      <Button variant="filled" disabled={registerMutation.isPending}>
        {registerMutation.isPending ? "Ro'yxatdan o'tilmoqda…" : "Ro'yxatdan o'tish"}
      </Button>
    </form>
  )
}
