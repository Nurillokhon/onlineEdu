import { useState } from 'react'
import type { ReactNode } from 'react'
import { TextField } from '../TextField'
import { EyeIcon, EyeOffIcon, LockIcon } from '../icons'
import { FormField } from './FormField'

interface PasswordFieldProps {
  value: string
  onChange: (value: string) => void
  label?: string
  action?: ReactNode
  errorText?: string
}

/** Password entry with a show/hide toggle. */
export function PasswordField({
  value,
  onChange,
  label = 'Parol',
  action,
  errorText,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <FormField label={label} action={action}>
      <TextField
        ariaLabel={label}
        type={visible ? 'text' : 'password'}
        placeholder="••••••••"
        value={value}
        onChange={onChange}
        errorText={errorText}
        leadingIcon={<LockIcon />}
        trailingIcon={
          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? 'Parolni yashirish' : "Parolni ko'rsatish"}
            className="p-1 rounded-full hover:text-ink"
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        }
      />
    </FormField>
  )
}
