/**
 * CORS configuration for Supabase Edge Functions
 *
 * Provides both permissive (for public endpoints) and restrictive (for authenticated endpoints) CORS headers.
 */

// Known application domains - add your production domains here
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8080',
  'https://amdir.app',
  'https://www.amdir.app',
  // Vercel preview deployments
  'https://*.vercel.app',
];

/**
 * Check if an origin is allowed
 */
function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;

  return ALLOWED_ORIGINS.some(allowed => {
    if (allowed.includes('*')) {
      // Handle wildcard patterns like *.vercel.app
      const pattern = allowed.replace('*', '.*');
      return new RegExp(`^${pattern}$`).test(origin);
    }
    return allowed === origin;
  });
}

/**
 * Get CORS headers for authenticated endpoints
 * Restricts to known application origins
 */
export function getAuthenticatedCorsHeaders(requestOrigin: string | null): Record<string, string> {
  const origin = isAllowedOrigin(requestOrigin) ? requestOrigin! : ALLOWED_ORIGINS[0];

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400', // 24 hours
  };
}

/**
 * Get CORS headers for public endpoints (e.g., serving published sites)
 * Allows any origin since published sites can be embedded anywhere
 */
export function getPublicCorsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };
}

/**
 * Handle CORS preflight request
 */
export function handleCorsPreflightRequest(headers: Record<string, string>): Response {
  return new Response(null, {
    status: 204,
    headers
  });
}
