import type { ReactNode } from 'react'
import { createElement } from 'react'
import { HomeIcon, BookIcon, PersonIcon } from '@/shared/ui'
import { paths } from '@/shared/config/routes'

export interface Destination {
  label: string
  to: string
  icon: (size?: number) => ReactNode
}

/** Shared by the bottom bar, the rail and the drawer, so all three stay in sync. */
export const destinations: Destination[] = [
  { label: 'Bosh sahifa', to: paths.dashboard, icon: (size) => createElement(HomeIcon, { size }) },
  { label: 'Kurslarim', to: paths.courses, icon: (size) => createElement(BookIcon, { size }) },
  { label: 'Profil', to: paths.profile, icon: (size) => createElement(PersonIcon, { size }) },
]
