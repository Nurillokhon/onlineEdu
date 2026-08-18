import { containerClass } from './container'

const stats = [
  { label: "Umumiy o'quvchilar soni", value: '+20,973' },
  { label: 'Yozilgan darslar soni', value: '+774' },
  { label: "O'rtacha jamoaviy tajriba", value: '+7 yil' },
]

export function StatsSection() {
  return (
    <section className={`${containerClass} mt-6`}>
      <div className="rounded-3xl bg-linear-to-r from-stats-from to-stats-to px-6 sm:px-12 py-10 sm:py-12">
        <div className="grid sm:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-card px-6 py-8 text-center">
              <p className="text-ink-muted text-sm">{stat.label}</p>
              <p className="font-display text-ink text-3xl font-bold mt-2">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
