import { MdOutlinedTextField } from '../material/outlined-text-field'

interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'password'
  required?: boolean
  errorText?: string
}

export function TextField({
  label,
  value,
  onChange,
  type = 'text',
  required,
  errorText,
}: TextFieldProps) {
  return (
    <div className="w-full">
      <MdOutlinedTextField
        label={label}
        value={value}
        type={type}
        required={required}
        error={Boolean(errorText)}
        errorText={errorText ?? ''}
        onInput={(event: Event) => onChange((event.target as HTMLElement & { value: string }).value)}
      />
    </div>
  )
}
