import { NextRequest, NextResponse } from 'next/server';

// List of known app domains (not custom domains)
const APP_DOMAINS = [
  'localhost',
  'vercel.app',
  'generative-web-factory.vercel.app',
  'amdir.app',
  'www.amdir.app',
];

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
  const domain = hostname.split(':')[0];

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
