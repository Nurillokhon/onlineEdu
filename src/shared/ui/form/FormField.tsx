import type { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  /** Optional control shown on the right of the label, e.g. a "forgot password" link. */
  action?: ReactNode
  children: ReactNode
}

/**
 * Label above the control. The control itself is a Material field whose input
 * lives in a shadow root, so it is named with `ariaLabel` rather than `htmlFor`.
 */
export function FormField({ label, action, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-ink">{label}</span>
        {action}
      </div>
      {children}
    </div>
  )
}
