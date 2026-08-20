import type { Mentor, Requirement } from '@/entities/course'
import { InfoIcon, MonitorIcon } from '@/shared/ui'

/** First letter of each of the first two words, e.g. "Malika Rustamova" → "MR". */
function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
}

function MentorCard({ mentor }: { mentor: Mentor }) {
  return (
    <section className="rounded-2xl border border-line bg-card p-5">
      <h2 className="font-display text-lg font-bold text-ink">Mentor haqida</h2>

      <div className="mt-4 flex flex-col items-center text-center">
        <span
          aria-hidden
          className="grid size-20 place-items-center rounded-full bg-brand-soft font-display text-xl font-bold text-brand"
        >
          {initials(mentor.name)}
        </span>
        <p className="mt-3 font-display text-lg text-ink">{mentor.name}</p>
        <p className="text-sm font-medium text-brand">{mentor.role}</p>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">{mentor.bio}</p>
      </div>
    </section>
  )
}

function RequirementsCard({ requirements }: { requirements: Requirement[] }) {
  return (
    <section className="rounded-2xl border border-line bg-card p-5">
      <h2 className="font-display text-lg font-bold text-ink">Talablar</h2>

      <ul className="mt-4 flex flex-col gap-3">
        {requirements.map((requirement) => (
          <li key={requirement.text} className="flex items-start gap-2.5 text-sm text-ink-muted">
            <span className="mt-0.5 shrink-0 text-ink-muted">
              {requirement.kind === 'equipment' ? <MonitorIcon size={18} /> : <InfoIcon size={18} />}
            </span>
            {requirement.text}
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Context that stays put while the learner moves between tabs. */
export function CourseSidebar({
  mentor,
  requirements,
}: {
  mentor: Mentor
  requirements: Requirement[]
}) {
  return (
    <aside className="flex flex-col gap-5">
      <MentorCard mentor={mentor} />
      <RequirementsCard requirements={requirements} />
    </aside>
  )
}
