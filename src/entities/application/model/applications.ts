export type ApplicationStatus = 'pending' | 'approved' | 'rejected'

export interface Application {
  id: string
  course: string
  submittedAt: string
  status: ApplicationStatus
  note: string
}

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  pending: "Ko'rib chiqilmoqda",
  approved: 'Tasdiqlangan',
  rejected: 'Rad etilgan',
}

// Demo data — replace with a request once the applications API exists.
export const applications: Application[] = [
  {
    id: 'app-1041',
    course: 'Tizim dizayni',
    submittedAt: '2024-11-04',
    status: 'approved',
    note: "Guruh 12-noyabrda boshlanadi.",
  },
  {
    id: 'app-1058',
    course: 'Frontend: React va TypeScript',
    submittedAt: '2024-11-18',
    status: 'pending',
    note: "Hujjatlar tekshirilmoqda, javob 3 ish kunida keladi.",
  },
  {
    id: 'app-1072',
    course: 'Data Science asoslari',
    submittedAt: '2024-12-02',
    status: 'rejected',
    note: "Kirish testi ballari yetarli emas. Qayta topshirish mumkin.",
  },
]
