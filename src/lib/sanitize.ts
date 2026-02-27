import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * Uses isomorphic-dompurify which works on both server (SSR) and client.
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    // Allow safe HTML tags
    ALLOWED_TAGS: [
      'b', 'i', 'u', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'span', 'div',
      'img', 'figure', 'figcaption', 'code', 'pre',
    ],
    // Allow safe attributes
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel',
      'width', 'height', 'style',
    ],
    // Only allow safe URL protocols
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
    // Force links to open in new tab safely
    ADD_ATTR: ['target', 'rel'],
    // Strip dangerous protocols
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'style'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
  });
}

/**
 * Sanitize plain text (strip all HTML)
 */
export function sanitizeText(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [], // No HTML allowed
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitize section content recursively
 * Applies sanitization to all string values in an object
 */
export function sanitizeSectionContent<T extends Record<string, unknown>>(content: T): T {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(content)) {
    if (typeof value === 'string') {
      // Sanitize string values
      sanitized[key] = sanitizeHtml(value);
    } else if (Array.isArray(value)) {
      // Recursively sanitize arrays
      sanitized[key] = value.map((item: unknown) => {
        if (typeof item === 'string') {
          return sanitizeHtml(item);
        } else if (typeof item === 'object' && item !== null) {
          return sanitizeSectionContent(item as Record<string, unknown>);
        }
        return item;
      }) as unknown;
    } else if (typeof value === 'object' && value !== null) {
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeSectionContent(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}
