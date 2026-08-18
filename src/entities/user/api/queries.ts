import { useMutation, useQuery } from '@tanstack/react-query'
import { loginRequest, registerRequest, fetchProfileStats, lookupCitizenRequest } from './requests'
import type { CitizenLookupPayload, LoginPayload, RegisterPayload } from './requests'

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => loginRequest(payload),
  })
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerRequest(payload),
  })
}

export function useCitizenLookupMutation() {
  return useMutation({
    mutationFn: (payload: CitizenLookupPayload) => lookupCitizenRequest(payload),
  })
}

export function useProfileStatsQuery() {
  return useQuery({
    queryKey: ['profile-stats'],
    queryFn: fetchProfileStats,
  })
}
