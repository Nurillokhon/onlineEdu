const PINFL_DIGITS = 14
const PASSPORT_PATTERN = /^[A-Z]{2}\d{7}$/

/** JShShIR (PINFL) is 14 digits; everything else is dropped as it is typed. */
export function toPinfl(input: string): string {
  return input.replace(/\D/g, '').slice(0, PINFL_DIGITS)
}

export function isPinflComplete(value: string): boolean {
  return value.length === PINFL_DIGITS
}

/** Passport is two letters plus seven digits, shown as "AA 1234567". */
export function toPassport(input: string): string {
  const raw = input.toUpperCase().replace(/[^A-Z0-9]/g, '')
  const letters = raw.slice(0, 2).replace(/[^A-Z]/g, '')
  // Digits only start once the two-letter series is there, so a stray digit
  // typed first is dropped instead of shifting into the number part.
  if (letters.length < 2) return letters
  const digits = raw.slice(2).replace(/\D/g, '').slice(0, 7)
  return digits ? `${letters} ${digits}` : letters
}

export function isPassportComplete(value: string): boolean {
  return PASSPORT_PATTERN.test(value.replace(/\s/g, ''))
}
