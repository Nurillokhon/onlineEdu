export type PaymentStatus = 'paid' | 'due'

export interface Payment {
  id: string
  course: string
  /** In so'm. */
  amount: number
  date: string
  method: string
  status: PaymentStatus
}

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  paid: "To'langan",
  due: 'Kutilmoqda',
}

/** Formats 1200000 as "1 200 000 so'm". */
export function formatAmount(amount: number): string {
  return `${amount.toLocaleString('ru-RU').replace(/ /g, ' ')} so'm`
}

// Demo data — replace with a request once the billing API exists.
export const payments: Payment[] = [
  {
    id: 'pay-3301',
    course: 'Tizim dizayni',
    amount: 1_200_000,
    date: '2024-11-05',
    method: 'Uzcard •••• 4417',
    status: 'paid',
  },
  {
    id: 'pay-3342',
    course: 'Frontend: React va TypeScript',
    amount: 1_450_000,
    date: '2024-12-01',
    method: 'Humo •••• 8820',
    status: 'paid',
  },
  {
    id: 'pay-3390',
    course: 'Frontend: React va TypeScript',
    amount: 1_450_000,
    date: '2025-01-01',
    method: 'Humo •••• 8820',
    status: 'due',
  },
]
