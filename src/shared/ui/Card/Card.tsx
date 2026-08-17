import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`rounded-xl p-6 shadow-sm bg-surface text-ink border border-line ${className}`}>
      {children}
    </div>
  )
}
