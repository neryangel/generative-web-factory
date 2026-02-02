/**
 * Shared CORS configuration for authenticated Edge Functions
 *
 * For public endpoints (like get-published-site), use "*" origin directly.
 */
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://generative-web-factory.vercel.app",
  "https://amdir.app",
  "https://www.amdir.app",
];

export function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("Origin");
  const isAllowed = origin && (
    ALLOWED_ORIGINS.includes(origin) ||
    origin.endsWith('.vercel.app')
  );

  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

/**
 * CORS headers for public endpoints that allow all origins.
 * Use for endpoints serving user content on custom domains.
 */
export const publicCorsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};
