/**
 * Shared validation utilities for edge functions
 */

/**
 * Validate UUID format
 */
export function isValidUuid(value: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * Validate domain name (RFC 1123)
 */
export function isValidDomain(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  if (value.length > 253) return false;

  // Remove trailing dot if present
  const domain = value.endsWith('.') ? value.slice(0, -1) : value;

  // RFC 1123 domain validation
  const domainRegex = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z0-9-]{1,63})*$/;
  if (!domainRegex.test(domain)) return false;

  // Must have at least one dot (TLD required)
  if (!domain.includes('.')) return false;

  return true;
}

/**
 * Validate email format
 */
export function isValidEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

/**
 * Validate slug format
 */
export function isValidSlug(value: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(value) && value.length >= 2 && value.length <= 63;
}

/**
 * Sanitize string input (remove potential XSS)
 */
export function sanitizeString(value: string): string {
  return value
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim();
}

/**
 * Validate and sanitize brief for AI generation
 */
export function validateBrief(value: unknown): { valid: boolean; error?: string; brief?: string } {
  if (typeof value !== 'string') {
    return { valid: false, error: 'Brief must be a string' };
  }

  const trimmed = value.trim();

  if (trimmed.length < 10) {
    return { valid: false, error: 'Brief must be at least 10 characters' };
  }

  if (trimmed.length > 5000) {
    return { valid: false, error: 'Brief must be less than 5000 characters' };
  }

  return { valid: true, brief: sanitizeString(trimmed) };
}

/**
 * Create error response helper
 */
export function errorResponse(
  message: string,
  status: number,
  headers: Record<string, string>
): Response {
  return new Response(
    JSON.stringify({ error: message }),
    { status, headers: { ...headers, "Content-Type": "application/json" } }
  );
}

/**
 * Create success response helper
 */
export function successResponse(
  data: unknown,
  headers: Record<string, string>
): Response {
  return new Response(
    JSON.stringify(data),
    { headers: { ...headers, "Content-Type": "application/json" } }
  );
}
