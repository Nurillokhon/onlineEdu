import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  useApplicantDocumentMutation,
  useApplicantProfileQuery,
  useSubmitApplicationMutation,
  type ApplicantDocument,
} from '@/entities/application'
import type { Course } from '@/entities/course'
import { paths } from '@/shared/config/routes'
import { ArrowRightIcon, CheckCircleIcon, Notice, Spinner } from '@/shared/ui'
import { DocumentsSection } from './DocumentsSection'
import { IdentitySection } from './IdentitySection'

function Submitted({ id, courseTitle }: { id: string; courseTitle: string }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-8 text-center sm:p-10">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-brand-soft text-brand">
        <CheckCircleIcon size={28} />
      </span>
      <h2 className="mt-4 font-display text-2xl font-bold text-ink">Arizangiz qabul qilindi</h2>
      <p className="mt-2 text-ink-muted">
        Ariza raqami: <strong className="font-semibold text-ink">{id}</strong> • {courseTitle}
      </p>
      <p className="mt-1 text-sm text-ink-muted">
        Hujjatlar 3 ish kunida tekshiriladi. Javob shu yerda va SMS orqali keladi.
      </p>
      <Link
        to={paths.applications}
        className="mt-6 inline-block rounded-xl bg-brand px-6 py-3 font-medium text-on-brand transition-colors hover:bg-brand-hover"
      >
        Mening arizalarim
      </Link>
    </div>
  )
}

interface ApplicationFormProps {
  course: Course
  /** Returns to whatever the form was opened from. */
  onCancel: () => void
}

/**
 * Application form for one course: registry-verified identity, documents pulled
 * from the state integrations, and one file the applicant attaches.
 */
export function ApplicationForm({ course, onCancel }: ApplicationFormProps) {
  const profileQuery = useApplicantProfileQuery()
  const documentMutation = useApplicantDocumentMutation()
  const submitMutation = useSubmitApplicationMutation()

  const [documents, setDocuments] = useState<ApplicantDocument[]>([])
  const [certificate, setCertificate] = useState<File | null>(null)

  // The query owns the first copy; edits after that live here, because pulling
  // a document changes only its status.
  useEffect(() => {
    if (profileQuery.data) setDocuments(profileQuery.data.documents)
  }, [profileQuery.data])

  function fetchDocument(document: ApplicantDocument) {
    documentMutation.mutate(document, {
      onSuccess: (updated) =>
        setDocuments((current) =>
          current.map((item) => (item.id === updated.id ? updated : item)),
        ),
    })
  }

  if (profileQuery.isPending) return <Spinner label="Ma'lumotlaringiz yuklanmoqda…" />

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <Notice alert>
        Ma'lumotlaringizni olishda xatolik yuz berdi. Sahifani qayta yuklab ko'ring.
      </Notice>
    )
  }

  if (submitMutation.isSuccess) {
    return <Submitted id={submitMutation.data.id} courseTitle={course.title} />
  }

  const missing = documents.filter((document) => document.status !== 'verified')

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-2xl font-bold text-ink">Ariza topshirish</h2>
        <p className="text-ink-muted">
          Iltimos, barcha maydonlarni diqqat bilan to'ldiring. Ma'lumotlar avtomatik tekshiriladi.
        </p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (missing.length > 0) return
          submitMutation.mutate({ courseId: course.id, certificateName: certificate?.name })
        }}
        className="flex flex-col gap-6 rounded-2xl border border-line bg-card p-5 sm:p-6 expanded:p-8"
      >
        <IdentitySection profile={profileQuery.data} />

        <DocumentsSection
          documents={documents}
          pendingId={documentMutation.isPending ? documentMutation.variables.id : null}
          onFetch={fetchDocument}
          certificate={certificate}
          onCertificateChange={setCertificate}
        />

        {missing.length > 0 ? (
          <Notice variant="info">
            Yuborishdan oldin quyidagi hujjatni yuklang: {missing.map((d) => d.label).join(', ')}.
          </Notice>
        ) : null}

        {submitMutation.isError ? (
          <Notice alert>Arizani yuborishda xatolik yuz berdi. Qayta urinib ko'ring.</Notice>
        ) : null}

        <div className="flex flex-wrap items-center justify-end gap-4 border-t border-line pt-5">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            Orqaga
          </button>

          <button
            type="submit"
            disabled={missing.length > 0 || submitMutation.isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 font-medium text-on-brand transition-colors hover:bg-brand-hover disabled:opacity-60"
          >
            {submitMutation.isPending ? 'Yuborilmoqda…' : 'Ariza topshirish'}
            <ArrowRightIcon size={18} />
          </button>
        </div>
      </form>
    </div>
  )
}
