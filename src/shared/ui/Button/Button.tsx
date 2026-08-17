import type { ReactNode, MouseEventHandler } from 'react'
import { MdFilledButton } from '../material/filled-button'
import { MdOutlinedButton } from '../material/outlined-button'
import { MdTextButton } from '../material/text-button'

export type ButtonVariant = 'filled' | 'outlined' | 'text'

interface ButtonProps {
  variant?: ButtonVariant
  disabled?: boolean
  onClick?: MouseEventHandler
  children: ReactNode
}

export function Button({ variant = 'filled', disabled, onClick, children }: ButtonProps) {
  if (variant === 'outlined') {
    return (
      <MdOutlinedButton disabled={disabled} onClick={onClick}>
        {children}
      </MdOutlinedButton>
    )
  }
  if (variant === 'text') {
    return (
      <MdTextButton disabled={disabled} onClick={onClick}>
        {children}
      </MdTextButton>
    )
  }
  return (
    <MdFilledButton disabled={disabled} onClick={onClick}>
      {children}
    </MdFilledButton>
  )
}
