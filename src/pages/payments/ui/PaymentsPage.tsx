import { payments, paymentStatusLabels, formatAmount } from '@/entities/payment'
import { StatusChip } from '@/shared/ui'

export function PaymentsPage() {
  const paid = payments.filter((payment) => payment.status === 'paid')
  const due = payments.filter((payment) => payment.status === 'due')

  const totalPaid = paid.reduce((sum, payment) => sum + payment.amount, 0)
  const totalDue = due.reduce((sum, payment) => sum + payment.amount, 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold text-ink">To'lovlar</h1>
        <p className="text-ink-muted text-sm">To'lov tarixi va kutilayotgan to'lovlar.</p>
      </div>

      <div className="grid medium:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-card border border-line px-5 py-4">
          <p className="text-ink-muted text-sm">Jami to'langan</p>
          <p className="text-ink text-2xl font-semibold mt-1">{formatAmount(totalPaid)}</p>
        </div>
        <div className="rounded-2xl bg-card border border-line px-5 py-4">
          <p className="text-ink-muted text-sm">Kutilayotgan to'lov</p>
          <p className="text-ink text-2xl font-semibold mt-1">{formatAmount(totalDue)}</p>
        </div>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg font-semibold text-ink">Tranzaksiyalar</h2>
        <div className="rounded-2xl bg-card border border-line divide-y divide-line">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="px-5 py-4 flex flex-wrap items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-ink truncate">{payment.course}</p>
                <p className="text-ink-muted text-sm">
                  {payment.date} · {payment.method}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-ink font-medium">{formatAmount(payment.amount)}</span>
                <StatusChip tone={payment.status === 'paid' ? 'success' : 'pending'}>
                  {paymentStatusLabels[payment.status]}
                </StatusChip>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
