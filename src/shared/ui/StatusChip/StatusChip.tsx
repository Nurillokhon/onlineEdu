import type { ReactNode } from 'react'

type Tone = 'success' | 'pending' | 'danger'

const TONES: Record<Tone, string> = {
  success: 'bg-brand-soft text-brand',
  pending: 'bg-info-soft text-ink',
  danger: 'bg-danger-soft text-danger',
}

/** Small status pill used by the applications and payments lists. */
export function StatusChip({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${TONES[tone]}`}>{children}</span>
  )
}
