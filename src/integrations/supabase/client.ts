import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

/**
 * Get required environment variable
 * Throws early if missing to prevent cryptic runtime errors
 */
function getRequiredEnvVar(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
      `Please set ${key} in your .env.local file.`
    );
  }

  return value;
}

const SUPABASE_URL = getRequiredEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const SUPABASE_ANON_KEY = getRequiredEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

/**
 * Supabase client instance
 * @example
 * import { supabase } from "@/integrations/supabase/client";
 */
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
