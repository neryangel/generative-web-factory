/**
 * Validate Israeli phone number
 * Accepts formats: 05X-XXXXXXX, 05XXXXXXXX, +972-5X-XXXXXXX, +9725XXXXXXXX
 */
export function isValidIsraeliPhone(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  // Remove spaces and dashes for normalization
  const cleaned = value.replace(/[\s-]/g, '');
  // Israeli mobile: 05X followed by 7 digits
  // Or international: +972 5X followed by 7 digits
  const israeliMobileRegex = /^(?:0[23489]\d{7}|05\d{8}|\+972[23489]\d{7}|\+9725\d{8})$/;
  return israeliMobileRegex.test(cleaned);
}

/**
 * Normalize phone number to international format
 */
export function normalizePhoneNumber(value: string): string {
  const cleaned = value.replace(/[\s-]/g, '');
  if (cleaned.startsWith('0')) {
    return '+972' + cleaned.slice(1);
  }
  return cleaned;
}
