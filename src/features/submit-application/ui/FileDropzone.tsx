import { useRef, useState } from 'react'
import { CheckCircleIcon, CloseIcon, UploadIcon } from '@/shared/ui'

const MAX_BYTES = 5 * 1024 * 1024
const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg']
const ACCEPT_ATTR = '.pdf,.jpg,.jpeg'

/** Rejection reason, or null when the file is fine. */
function reject(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return 'Faqat PDF yoki JPG fayl yuklash mumkin.'
  }
  if (file.size > MAX_BYTES) {
    return 'Fayl hajmi 5MB dan oshmasligi kerak.'
  }
  return null
}

function formatSize(bytes: number) {
  const mb = bytes / 1024 / 1024
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`
}

interface FileDropzoneProps {
  label: string
  hint: string
  file: File | null
  onChange: (file: File | null) => void
}

/** Attach one file, by picking it or by dropping it on the panel. */
export function FileDropzone({ label, hint, file, onChange }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function accept(candidate: File | undefined) {
    if (!candidate) return
    const reason = reject(candidate)
    setError(reason)
    onChange(reason ? null : candidate)
  }

  function clear() {
    setError(null)
    onChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  if (file) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-line bg-card p-4">
        <span className="shrink-0 text-brand">
          <CheckCircleIcon size={20} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium text-ink">{file.name}</span>
          <span className="block text-sm text-ink-muted">
            {label} • {formatSize(file.size)}
          </span>
        </span>
        <button
          type="button"
          onClick={clear}
          aria-label={`${file.name} faylini olib tashlash`}
          className="shrink-0 rounded-full p-1.5 text-ink-muted transition-colors hover:bg-brand-softer hover:text-ink"
        >
          <CloseIcon size={18} />
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          accept(event.dataTransfer.files[0])
        }}
        className={`flex flex-col items-center gap-2 rounded-xl border border-dashed p-8 text-center transition-colors ${
          dragging ? 'border-brand bg-brand-softer' : 'border-line'
        }`}
      >
        <span className="grid size-11 place-items-center rounded-xl bg-brand-softer text-brand">
          <UploadIcon size={20} />
        </span>

        <p className="font-medium text-ink">{label}</p>
        <p className="text-sm text-ink-muted">{hint}</p>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_ATTR}
          onChange={(event) => accept(event.target.files?.[0])}
          className="sr-only"
          aria-label={label}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-brand-hover"
        >
          Fayl tanlash
        </button>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}
