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
