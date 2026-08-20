import { Link } from 'react-router-dom'
import { MdSwitch } from '@/shared/ui/material/switch'
import { useAuth } from '@/entities/user'
import { usePersistentState, formatPhone, toPhoneDigits } from '@/shared/lib'
import { paths } from '@/shared/config/routes'

interface Preferences {
  emailNotifications: boolean
  smsNotifications: boolean
  weeklyDigest: boolean
}

const DEFAULTS: Preferences = {
  emailNotifications: true,
  smsNotifications: false,
  weeklyDigest: true,
}

const ROWS: { key: keyof Preferences; label: string; hint: string }[] = [
  {
    key: 'emailNotifications',
    label: 'Elektron pochta xabarnomalari',
    hint: 'Yangi dars va topshiriqlar haqida xabar keladi.',
  },
  {
    key: 'smsNotifications',
    label: 'SMS xabarnomalari',
    hint: "To'lov muddati va guruh o'zgarishlari haqida SMS.",
  },
  {
    key: 'weeklyDigest',
    label: 'Haftalik hisobot',
    hint: "Har dushanba o'tgan haftadagi natijalaringiz.",
  },
]

export function SettingsPage() {
  const { user } = useAuth()
  // Kept in localStorage until the preferences API exists.
  const [preferences, setPreferences] = usePersistentState<Preferences>(
    'eduflow:preferences',
    DEFAULTS,
  )

  const phone = user?.phone ? formatPhone(toPhoneDigits(user.phone)) : null

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold text-ink">Sozlamalar</h1>
        <p className="text-ink-muted text-sm">Hisob ma'lumotlari va xabarnoma sozlamalari.</p>
      </div>

      <section className="rounded-2xl bg-card border border-line p-5 flex flex-col gap-4">
        <h2 className="font-display text-lg font-semibold text-ink">Hisob</h2>
        <dl className="grid medium:grid-cols-2 gap-4">
          <div className="rounded-xl bg-brand-softer px-4 py-3">
            <dt className="text-ink-muted text-sm">Ism</dt>
            <dd className="text-ink">{user?.name ?? '—'}</dd>
          </div>
          <div className="rounded-xl bg-brand-softer px-4 py-3">
            <dt className="text-ink-muted text-sm">Telefon</dt>
            <dd className="text-ink">{phone ?? 'Kiritilmagan'}</dd>
          </div>
        </dl>
        <Link to={paths.profile} className="text-sm text-brand-hover hover:underline self-start">
          Profilni ko'rish
        </Link>
      </section>

      <section className="rounded-2xl bg-card border border-line p-5 flex flex-col gap-4">
        <h2 className="font-display text-lg font-semibold text-ink">Xabarnomalar</h2>
        <div className="flex flex-col divide-y divide-line">
          {ROWS.map((row) => (
            <label
              key={row.key}
              className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4 cursor-pointer"
            >
              <span className="min-w-0">
                <span className="block text-ink">{row.label}</span>
                <span className="block text-ink-muted text-sm">{row.hint}</span>
              </span>
              <MdSwitch
                selected={preferences[row.key]}
                aria-label={row.label}
                onChange={(event: Event) =>
                  setPreferences({
                    ...preferences,
                    [row.key]: (event.target as HTMLElement & { selected: boolean }).selected,
                  })
                }
              />
            </label>
          ))}
        </div>
      </section>
    </div>
  )
}
