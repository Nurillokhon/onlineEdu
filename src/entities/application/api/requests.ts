import type {
  ApplicantDocument,
  ApplicantProfile,
  SubmitApplicationPayload,
  SubmitApplicationResult,
} from '../model/applicant'

function delay<T>(value: T, ms = 600): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

// Demo/mock only — swap these bodies for real `fetch` calls against
// `API_BASE_URL` (see src/shared/config/env.ts) once a backend exists. The
// signatures below are what the rest of the app depends on, so keep them
// stable when doing that swap.

/**
 * The signed-in citizen as the IIV registry knows them, plus what the document
 * integrations currently hold. The real endpoint reads the session, so nothing
 * identifying is passed in.
 */
export async function fetchApplicantProfile(): Promise<ApplicantProfile> {
  return delay({
    pinfl: '31405920392011',
    passport: 'AC 1234567',
    fullName: "ABDULLAYEV AZIZBEK ALISHER O'G'LI",
    documents: [
      {
        id: 'diploma',
        label: "Oliy ma'lumot diplomi",
        source: 'diplom.edu.uz orqali integratsiya',
        status: 'available',
      },
      {
        id: 'employment',
        label: 'Mehnat daftarchasi',
        source: 'my.mehnat.uz orqali integratsiya',
        status: 'verified',
      },
    ],
  })
}

/** Pulls one document from its registry and returns it verified. */
export async function fetchApplicantDocument(document: ApplicantDocument) {
  return delay<ApplicantDocument>({ ...document, status: 'verified' }, 900)
}

export async function submitApplicationRequest(
  payload: SubmitApplicationPayload,
): Promise<SubmitApplicationResult> {
  if (!payload.courseId) {
    throw new Error('courseId is required')
  }
  return delay({ id: `APP-${Date.now().toString().slice(-6)}` }, 900)
}
