import type { ReactNode } from 'react'

interface ActionButtonProps {
  children: ReactNode
  type?: 'button' | 'submit'
  variant?: 'primary' | 'secondary'
  fullWidth?: boolean
  disabled?: boolean
  icon?: ReactNode
  /** Where the icon sits relative to the label. */
  iconPosition?: 'start' | 'end'
  onClick?: () => void
}

const VARIANTS = {
  primary: 'bg-brand text-on-brand hover:bg-brand-hover',
  secondary: 'border border-line bg-brand-softer text-ink hover:bg-brand-soft',
} as const

/** The app's own button shape: squared corners, brand fill, optional icon. */
export function ActionButton({
  children,
  type = 'button',
  variant = 'primary',
  fullWidth,
  disabled,
  icon,
  iconPosition = 'start',
  onClick,
}: ActionButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors disabled:opacity-60 ${
        VARIANTS[variant]
      } ${fullWidth ? 'w-full py-3' : 'px-4 py-2.5 text-sm'}`}
    >
      {iconPosition === 'start' ? icon : null}
      {children}
      {iconPosition === 'end' ? icon : null}
    </button>
  )
}
