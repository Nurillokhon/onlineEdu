import { RefreshIcon, ShieldIcon } from '../icons'

interface CaptchaFieldProps {
  /** Rendered sum, e.g. "15 + 7 =". */
  question: string
  value: string
  onChange: (value: string) => void
  onRefresh: () => void
  errorText?: string
}

export function CaptchaField({
  question,
  value,
  onChange,
  onRefresh,
  errorText,
}: CaptchaFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="rounded-xl bg-info-soft px-4 py-3 flex flex-wrap items-center gap-3">
        <span className="text-brand">
          <ShieldIcon />
        </span>
        <span className="text-sm text-ink">
          CAPTCHA ni yeching: <strong className="font-semibold">{question}</strong>
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(event) => onChange(event.target.value.replace(/\D/g, '').slice(0, 3))}
          aria-label="CAPTCHA javobi"
          aria-invalid={Boolean(errorText)}
          placeholder="?"
          className={`ml-auto w-16 rounded-xl bg-surface px-3 py-2 text-center text-ink border ${
            errorText ? 'border-danger' : 'border-line'
          }`}
        />
        <button
          type="button"
          onClick={onRefresh}
          aria-label="Yangi misol"
          className="text-ink-muted hover:text-ink"
        >
          <RefreshIcon />
        </button>
      </div>
      {errorText ? <p className="text-sm text-danger">{errorText}</p> : null}
    </div>
  )
}
