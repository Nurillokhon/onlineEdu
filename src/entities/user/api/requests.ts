import type { User } from '../model/types'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
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
    name: payload.email.split('@')[0],
    email: payload.email,
  })
}

export async function registerRequest(payload: RegisterPayload): Promise<User> {
  return delay({
    id: 'demo-user-1',
    name: payload.name,
    email: payload.email,
  })
}

export async function fetchProfileStats(): Promise<ProfileStats> {
  return delay({
    coursesCompleted: 4,
    hoursLearned: 37,
    streakDays: 12,
  })
}
