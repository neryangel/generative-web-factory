/**
 * Shared validation patterns used across the application.
 * Keeps regex patterns in one place to avoid inconsistencies.
 */

/**
 * RFC 1123 compliant domain validation regex.
 * Allows alphanumeric characters, hyphens, and dots.
 * Requires at least one dot and a valid TLD (2+ chars).
 * Max 63 characters per label.
 */
export const DOMAIN_REGEX = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

/**
 * Validates a domain name format.
 */
export function isValidDomain(domain: string): boolean {
  if (!domain || domain.length > 253) return false;
  return DOMAIN_REGEX.test(domain);
}

/**
 * Reserved slug names that conflict with app routes or system paths.
 * Site slugs must not use any of these values.
 */
const RESERVED_SLUGS = new Set([
  'dashboard', 'admin', 'api', 'auth', 'login', 'logout', 'signup', 'register',
  'settings', 'account', 'profile', 'sites', 'templates', 'billing',
  's', 'app', 'www', 'mail', 'ftp', 'static', 'assets', 'public',
  'health', 'status', 'docs', 'help', 'support', 'about', 'contact',
  'privacy', 'terms', 'legal', 'blog', 'news',
]);

/**
 * Check if a slug is reserved (conflicts with app routes).
 */
export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.toLowerCase().trim());
}

/**
 * Password validation constants.
 * NOTE: Assumes ASCII characters only (Hebrew/emoji not validated).
 */
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_HAS_UPPERCASE = /[A-Z]/;
export const PASSWORD_HAS_LOWERCASE = /[a-z]/;
export const PASSWORD_HAS_NUMBER = /\d/;
export const PASSWORD_STRONG = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

/**
 * Hebrew labels for password requirements.
 */
export const PASSWORD_REQUIREMENTS = {
  minLength: 'לפחות 8 תווים',
  uppercase: 'אות גדולה באנגלית',
  lowercase: 'אות קטנה באנגלית',
  number: 'ספרה אחת לפחות'
};

/**
 * Hebrew labels for password strength.
 */
export const PASSWORD_STRENGTH_LABELS = {
  weak: 'חלשה',
  medium: 'בינונית',
  strong: 'חזקה'
};

/**
 * Hebrew messages for password confirmation.
 */
export const PASSWORD_CONFIRMATION_MESSAGES = {
  match: 'הסיסמאות זהות',
  noMatch: 'הסיסמאות אינן זהות'
};

/**
 * Password validation result type.
 */
export interface PasswordValidationResult {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  score: number;
  strength: 'weak' | 'medium' | 'strong';
  isValid: boolean;
}

/**
 * Validates a password against all 4 requirements.
 * Returns detailed breakdown of which rules pass/fail.
 *
 * NOTE: Assumes ASCII characters only - Hebrew/emoji not validated.
 *
 * @param password - The password to validate
 * @returns Object with individual rule results, score (0-4), strength, and isValid flag
 */
export function validatePassword(password: string): PasswordValidationResult {
  const hasMinLength = password.length >= PASSWORD_MIN_LENGTH;
  const hasUppercase = PASSWORD_HAS_UPPERCASE.test(password);
  const hasLowercase = PASSWORD_HAS_LOWERCASE.test(password);
  const hasNumber = PASSWORD_HAS_NUMBER.test(password);

  const score = [hasMinLength, hasUppercase, hasLowercase, hasNumber].filter(Boolean).length;

  let strength: 'weak' | 'medium' | 'strong';
  if (score <= 2) {
    strength = 'weak';
  } else if (score === 3) {
    strength = 'medium';
  } else {
    strength = 'strong';
  }

  const isValid = score === 4;

  return {
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    score,
    strength,
    isValid
  };
}
