import type { ReactNode } from 'react'
import type { ApplicantDocument } from '@/entities/application'
import {
  BriefcaseIcon,
  CheckCircleIcon,
  DiplomaIcon,
  GraduationCapIcon,
  RefreshIcon,
} from '@/shared/ui'
import { FileDropzone } from './FileDropzone'
import { SectionHeading } from './IdentitySection'

const DOCUMENT_ICONS: Record<string, ReactNode> = {
  diploma: <DiplomaIcon size={20} />,
  employment: <BriefcaseIcon size={20} />,
}

interface DocumentRowProps {
  document: ApplicantDocument
  pending: boolean
  onFetch: () => void
}

function DocumentRow({ document, pending, onFetch }: DocumentRowProps) {
  const verified = document.status === 'verified'

  return (
    // Stacked on narrow windows: the label, the source and the action do not
    // fit on one line beside the rail, and the label would spill over the button.
    <li className="flex flex-col gap-3 rounded-xl border border-line bg-card p-4 medium:flex-row medium:items-center medium:gap-4">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-softer text-brand">
          {DOCUMENT_ICONS[document.id] ?? <DiplomaIcon size={20} />}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block font-medium text-ink">{document.label}</span>
          <span className="block text-sm text-ink-muted">{document.source}</span>
        </span>
      </div>

      {verified ? (
        <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl bg-brand-soft px-4 py-2.5 text-sm font-medium text-brand medium:self-auto">
          <CheckCircleIcon size={16} />
          Tasdiqlangan
        </span>
      ) : (
        <button
          type="button"
          onClick={onFetch}
          disabled={pending}
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-on-brand transition-colors hover:bg-brand-hover disabled:opacity-60 medium:self-auto"
        >
          <span className={pending ? 'animate-spin motion-reduce:animate-none' : undefined}>
            <RefreshIcon size={16} />
          </span>
          {pending ? 'Yuklanmoqda' : 'Yuklash'}
        </button>
      )}
    </li>
  )
}

interface DocumentsSectionProps {
  documents: ApplicantDocument[]
  /** Id of the document currently being pulled, if any. */
  pendingId: string | null
  onFetch: (document: ApplicantDocument) => void
  certificate: File | null
  onCertificateChange: (file: File | null) => void
}

/** Registry-backed documents, plus the one file the applicant supplies. */
export function DocumentsSection({
  documents,
  pendingId,
  onFetch,
  certificate,
  onCertificateChange,
}: DocumentsSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <SectionHeading icon={<GraduationCapIcon size={20} />}>Ta'lim va Hujjatlar</SectionHeading>

      <ul className="flex flex-col gap-3">
        {documents.map((document) => (
          <DocumentRow
            key={document.id}
            document={document}
            pending={pendingId === document.id}
            onFetch={() => onFetch(document)}
          />
        ))}
      </ul>

      <FileDropzone
        label="Chet tili sertifikati (IELTS / Milliy)"
        hint="PDF, JPG formatida, max 5MB"
        file={certificate}
        onChange={onCertificateChange}
      />
    </section>
  )
}
