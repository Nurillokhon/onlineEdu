import { applications, applicationStatusLabels } from '@/entities/application'
import type { ApplicationStatus } from '@/entities/application'
import { StatusChip } from '@/shared/ui'

const TONES: Record<ApplicationStatus, 'success' | 'pending' | 'danger'> = {
  approved: 'success',
  pending: 'pending',
  rejected: 'danger',
}

export function ApplicationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold text-ink">Mening arizalarim</h1>
        <p className="text-ink-muted text-sm">
          Yuborilgan arizalar va ularning holati shu yerda ko'rinadi.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {applications.map((application) => (
          <article
            key={application.id}
            className="rounded-2xl bg-card border border-line p-5 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-ink">{application.course}</p>
                <p className="text-ink-muted text-sm">
                  {application.id} · {application.submittedAt}
                </p>
              </div>
              <StatusChip tone={TONES[application.status]}>
                {applicationStatusLabels[application.status]}
              </StatusChip>
            </div>
            <p className="text-ink-muted text-sm">{application.note}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
