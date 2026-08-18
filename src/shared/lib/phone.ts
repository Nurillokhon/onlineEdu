const COUNTRY_CODE = '998'
const LOCAL_DIGITS = 9

/** Keeps only the national part: 9 digits after the 998 country code. */
export function toPhoneDigits(input: string): string {
  const digits = input.replace(/\D/g, '')
  const national = digits.startsWith(COUNTRY_CODE) ? digits.slice(COUNTRY_CODE.length) : digits
  return national.slice(0, LOCAL_DIGITS)
}

/** Renders 901234567 as "+998 (90) 123-45-67", growing as the user types. */
export function formatPhone(digits: string): string {
  if (!digits) return ''
  const parts = [
    digits.slice(0, 2),
    digits.slice(2, 5),
    digits.slice(5, 7),
    digits.slice(7, 9),
  ].filter(Boolean)

  let text = `+${COUNTRY_CODE} (${parts[0]}`
  if (parts.length === 1) return digits.length < 2 ? text : `${text})`
  text += `) ${parts[1]}`
  if (parts[2]) text += `-${parts[2]}`
  if (parts[3]) text += `-${parts[3]}`
  return text
}

export function isPhoneComplete(digits: string): boolean {
  return digits.length === LOCAL_DIGITS
}

/** What the API receives: country code plus the national digits. */
export function toApiPhone(digits: string): string {
  return `${COUNTRY_CODE}${digits}`
}
