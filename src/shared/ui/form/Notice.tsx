import type { ReactNode } from 'react'
import { AlertIcon } from '../icons'

interface NoticeProps {
  variant?: 'info' | 'danger'
  /** Set for messages that appear as a result of the user's action. */
  alert?: boolean
  children: ReactNode
}

/** Inline strip for a warning or a form-level error. */
export function Notice({ variant = 'danger', alert, children }: NoticeProps) {
  const tone = variant === 'danger' ? 'bg-danger-soft text-danger' : 'bg-info-soft text-ink'
  return (
    <p role={alert ? 'alert' : undefined} className={`rounded-xl ${tone} text-sm px-4 py-3 flex items-start gap-2`}>
      <span className="mt-0.5 shrink-0">
        <AlertIcon />
      </span>
      {children}
    </p>
  )
}
