import { MdCircularProgress } from '../material/circular-progress'

interface SpinnerProps {
  label?: string
}

export function Spinner({ label = 'Yuklanmoqda…' }: SpinnerProps) {
  return (
    <div className="flex items-center justify-center gap-2 p-4" role="status">
      <MdCircularProgress indeterminate />
      <span className="text-ink">{label}</span>
    </div>
  )
}
