/** A document the platform pulls from a state integration rather than asking for. */
export interface ApplicantDocument {
  id: string
  label: string
  /** Which registry it comes from, e.g. "diplom.edu.uz orqali integratsiya". */
  source: string
  /** 'verified' once the registry has answered; 'available' until it is pulled. */
  status: 'verified' | 'available'
}

/**
 * Who is applying, as the registries know them. The identity fields are
 * read-only on the form: they come from the IIV lookup, not from typing.
 */
export interface ApplicantProfile {
  pinfl: string
  /** Formatted, e.g. "AC 1234567". */
  passport: string
  fullName: string
  documents: ApplicantDocument[]
}

export interface SubmitApplicationPayload {
  courseId?: string
  /** The optional language certificate the applicant attached. */
  certificateName?: string
}

export interface SubmitApplicationResult {
  id: string
}
