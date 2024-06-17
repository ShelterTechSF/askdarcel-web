/**
 * Round numbers to a specified decimal place.
 *
 * E.g.
 * round(-122.312360, 4) -> -122.3124
 * round(33.102938, 2) -> -33.10
 */
export function round(value: number, decimals: number) {
  return Number(`${Math.round(Number(`${value}e${decimals}`))}e-${decimals}`);
}

/**
 * Strip phone numbers of non-numeric characters for callable tel: numbers and add +1 for US calling
 *
 * E.g.
 * '555-555-5555' -> +15555555555
 */
export function callableUSPhoneNumber(phoneNumber: string) {
  const numbersOnly = phoneNumber.replace(/\D/g, "");
  const formattedNumber = `+1${numbersOnly}`;
  return formattedNumber;
}

/**
 * Formats a phone number string into the format XXX-XXX-XXXX.
 *
 * E.g.
 * "1234567890" -> "123-456-7890"
 */
export const formatPhoneNumber = (
  number: string | null | undefined
): string => {
  if (!number) {
    return "";
  }

  const cleaned = number.toString().replace(/\D/g, "");
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return [match[2], "-", match[3], "-", match[4]].join("");
  }

  return number;
};
