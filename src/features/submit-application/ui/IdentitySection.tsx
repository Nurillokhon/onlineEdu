import type { ReactNode } from 'react'
import type { ApplicantProfile } from '@/entities/application'
import { CheckCircleIcon, IdCardIcon } from '@/shared/ui'

export function SectionHeading({
  icon,
  children,
  badge,
}: {
  icon: ReactNode
  children: ReactNode
  badge?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
      <h2 className="inline-flex items-center gap-2 font-medium text-ink">
        <span className="text-brand">{icon}</span>
        {children}
      </h2>
      {badge}
    </div>
  )
}

/**
 * One registry-sourced value. Read-only by design: it is what the IIV lookup
 * returned, so it is shown rather than typed, and the tick says it is checked.
 */
function VerifiedField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm text-ink-muted">{label}</span>
      <p className="flex items-center justify-between gap-3 rounded-xl bg-brand-softer px-4 py-3 text-ink">
        <span className="min-w-0 break-words">{value}</span>
        <span className="shrink-0 text-brand" title="Tasdiqlangan">
          <CheckCircleIcon size={20} />
        </span>
      </p>
    </div>
  )
}

/** The applicant's identity, straight from the state registry. */
export function IdentitySection({ profile }: { profile: ApplicantProfile }) {
  return (
    <section className="flex flex-col gap-4">
      <SectionHeading
        icon={<IdCardIcon size={20} />}
        badge={
          <span className="rounded-lg border border-brand px-3 py-1.5 text-xs font-medium text-brand">
            IIV bazasidan tasdiqlangan
          </span>
        }
      >
        Shaxsiy ma'lumotlar
      </SectionHeading>

      <div className="grid gap-4 medium:grid-cols-2">
        <VerifiedField label="JShShIR" value={profile.pinfl} />
        <VerifiedField label="Pasport seriyasi va raqami" value={profile.passport} />
      </div>

      <VerifiedField label="F.I.Sh." value={profile.fullName} />
    </section>
  )
}
