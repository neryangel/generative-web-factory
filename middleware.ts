import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { DOMAIN_REGEX } from '@/lib/validation-patterns';

/**
 * App domains configuration - loaded from environment variable
 * Format: comma-separated list of domains (e.g., "localhost,vercel.app,amdir.app")
 * Defaults provided for development; override in production via APP_DOMAINS env var
 */
const DEFAULT_APP_DOMAINS = 'localhost,vercel.app,amdir.app,www.amdir.app';
const APP_DOMAINS = (process.env.APP_DOMAINS || DEFAULT_APP_DOMAINS)
  .split(',')
  .map(d => d.trim())
  .filter(Boolean);

/**
 * Validates and sanitizes a domain name to prevent injection attacks
 * Returns null if the domain is invalid
 */
function validateDomain(domain: string): string | null {
  // Check length constraints
  if (!domain || domain.length > 253 || domain.length < 1) {
    return null;
  }

  // Check for path traversal attempts
  if (domain.includes('/') || domain.includes('\\') || domain.includes('..')) {
    return null;
  }

  // Validate against RFC 1123 pattern
  if (!DOMAIN_REGEX.test(domain)) {
    return null;
  }

  // Additional check: each label must be max 63 characters
  const labels = domain.split('.');
  if (labels.some(label => label.length > 63)) {
    return null;
  }

  return domain.toLowerCase();
}

export const config = {
  matcher: [
    // Match all paths except static files and API routes
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Extract domain without port
  const rawDomain = hostname.split(':')[0];

  // Validate and sanitize the domain
  const domain = validateDomain(rawDomain);

  // If domain is invalid, return 400 Bad Request
  if (!domain) {
    return new NextResponse('Invalid domain', { status: 400 });
  }

  // Check if this is a known app domain
  const isAppDomain = APP_DOMAINS.some(
    (appDomain) => domain === appDomain || domain.endsWith(`.${appDomain}`)
  );

  // If it's an app domain, continue with normal routing
  if (isAppDomain) {
    return NextResponse.next();
  }

  // This is a custom domain - rewrite to the site route
  // The site route will handle fetching content by domain
  url.pathname = `/sites/${domain}${pathname}`;

  return NextResponse.rewrite(url);
}
