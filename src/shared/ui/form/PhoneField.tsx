import { TextField } from '../TextField'
import { PhoneIcon } from '../icons'
import { FormField } from './FormField'
import { formatPhone, toPhoneDigits } from '@/shared/lib'

interface PhoneFieldProps {
  /** National digits only, e.g. "901234567". */
  value: string
  onChange: (digits: string) => void
  label?: string
  errorText?: string
}

/** Uzbek phone entry: +998 mask, digits-only state, shared by every auth form. */
export function PhoneField({ value, onChange, label = 'Telefon raqami', errorText }: PhoneFieldProps) {
  return (
    <FormField label={label}>
      <TextField
        ariaLabel={label}
        type="tel"
        placeholder="+998 (__) ___-__-__"
        value={formatPhone(value)}
        format={(raw) => formatPhone(toPhoneDigits(raw))}
        onChange={(next) => onChange(toPhoneDigits(next))}
        errorText={errorText}
        leadingIcon={<PhoneIcon />}
      />
    </FormField>
  )
}
