import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Next.js requires direct access to NEXT_PUBLIC_* env vars for proper inlining at build time
// Dynamic access via process.env[key] doesn't work because Next.js replaces these at compile time
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Log warning in development if env vars are missing (don't throw to avoid breaking the app)
if (typeof window !== 'undefined' && (!SUPABASE_URL || !SUPABASE_ANON_KEY)) {
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      'Supabase environment variables are not configured.\n' +
      'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
    );
  }
}

/**
 * Supabase client instance
 * @example
 * import { supabase } from "@/integrations/supabase/client";
 */
/**
 * SECURITY NOTE: Auth tokens are stored in localStorage for session persistence.
 * localStorage is vulnerable to XSS attacks -- if an attacker can run JS on this
 * origin, they can steal the auth token. The trade-off is accepted here because:
 * 1. Content-Security-Policy headers mitigate XSS risk significantly.
 * 2. Supabase JS client does not natively support httpOnly cookies in client mode.
 * 3. All user-generated content is sanitized via DOMPurify (isomorphic-dompurify).
 * If stricter security is needed, consider using Supabase SSR auth with httpOnly cookies.
 */
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
