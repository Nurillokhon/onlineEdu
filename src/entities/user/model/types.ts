export interface User {
  id: string
  name: string
  /** Set when the account was created with an email (registration). */
  email?: string
  /** Set when the account signed in by phone number. */
  phone?: string
}
