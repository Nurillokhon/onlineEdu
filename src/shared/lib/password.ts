export interface PasswordStrength {
  /** 0 (empty) to 4 (meets every rule). */
  score: number
  label: string
  meetsPolicy: boolean
}

const RULES = [
  (value: string) => value.length >= 8,
  (value: string) => /[A-Z]/.test(value),
  (value: string) => /[^A-Za-z0-9]/.test(value),
  (value: string) => /\d/.test(value),
]

/** Policy shown under the field: 8+ characters, an uppercase letter, a symbol. */
export function passwordStrength(value: string): PasswordStrength {
  if (!value) return { score: 0, label: '', meetsPolicy: false }
  const score = RULES.filter((rule) => rule(value)).length
  const meetsPolicy = RULES.slice(0, 3).every((rule) => rule(value))
  const label = score <= 1 ? 'Kuchsiz' : score <= 2 ? "O'rtacha" : score === 3 ? 'Yaxshi' : 'Kuchli'
  return { score, label, meetsPolicy }
}
