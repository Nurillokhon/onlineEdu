import { useMutation, useQuery } from '@tanstack/react-query'
import type { ApplicantDocument, SubmitApplicationPayload } from '../model/applicant'
import {
  fetchApplicantDocument,
  fetchApplicantProfile,
  submitApplicationRequest,
} from './requests'

export function useApplicantProfileQuery() {
  return useQuery({
    queryKey: ['applicant-profile'],
    queryFn: fetchApplicantProfile,
  })
}

export function useApplicantDocumentMutation() {
  return useMutation({
    mutationFn: (document: ApplicantDocument) => fetchApplicantDocument(document),
  })
}

export function useSubmitApplicationMutation() {
  return useMutation({
    mutationFn: (payload: SubmitApplicationPayload) => submitApplicationRequest(payload),
  })
}
