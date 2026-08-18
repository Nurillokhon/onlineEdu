import type { User } from '../model/types'

export interface LoginPayload {
  /** Digits only, e.g. 998901234567. */
  phone: string
  password: string
}

export interface RegisterPayload {
  /** JShShIR (PINFL), 14 digits. */
  pinfl: string
  /** Passport serial and number, e.g. "AA 1234567". */
  passport: string
  /** Full name as returned by the citizen lookup. */
  name: string
  phone: string
  email: string
  password: string
}

export interface CitizenLookupPayload {
  pinfl: string
  passport: string
}

/** What the IIV (Ministry of Internal Affairs) registry returns. */
export interface Citizen {
  name: string
  address: string
}

export interface ProfileStats {
  coursesCompleted: number
  hoursLearned: number
  streakDays: number
}

function delay<T>(value: T, ms = 600): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

// Demo/mock only — swap these bodies for real `fetch` calls against
// `API_BASE_URL` (see src/shared/config/env.ts) once a backend exists. The
// signatures below are what the rest of the app depends on, so keep them
// stable when doing that swap.
export async function loginRequest(payload: LoginPayload): Promise<User> {
  return delay({
    id: 'demo-user-1',
    name: 'Foydalanuvchi',
    phone: payload.phone,
  })
}

export async function registerRequest(payload: RegisterPayload): Promise<User> {
  return delay({
    id: 'demo-user-1',
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
  })
}

// Mock stand-in for the IIV registry lookup. The real call takes the PINFL and
// passport and returns the citizen record; keep this signature when wiring it.
export async function lookupCitizenRequest(payload: CitizenLookupPayload): Promise<Citizen> {
  if (!payload.pinfl || !payload.passport) {
    throw new Error('pinfl and passport are required')
  }
  return delay({
    name: "Abdullayev Abdulla Abdulla o'g'li",
    address: 'Toshkent shahar, Yunusobod tumani, 19-mavze, 42-uy',
  })
}

export async function fetchProfileStats(): Promise<ProfileStats> {
  return delay({
    coursesCompleted: 4,
    hoursLearned: 37,
    streakDays: 12,
  })
}
