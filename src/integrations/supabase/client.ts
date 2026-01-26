import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

/**
 * Get environment variable with support for both Vite and Next.js
 * Throws early if required variable is missing to prevent cryptic runtime errors
 */
function getRequiredEnvVar(viteKey: string, nextKey: string, name: string): string {
  // Check Vite environment first
  // @ts-ignore - import.meta.env exists in Vite
  if (typeof import.meta !== 'undefined' && import.meta.env?.[viteKey]) {
    // @ts-ignore
    return import.meta.env[viteKey];
  }

  // Check Next.js environment
  if (typeof process !== 'undefined' && process.env?.[nextKey]) {
    return process.env[nextKey] as string;
  }

  // Fail early with clear error message
  throw new Error(
    `Missing required environment variable: ${name}\n` +
    `Please set either ${viteKey} (for Vite) or ${nextKey} (for Next.js) in your .env file.`
  );
}

const SUPABASE_URL = getRequiredEnvVar(
  'VITE_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_URL'
);

const SUPABASE_ANON_KEY = getRequiredEnvVar(
  'VITE_SUPABASE_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_ANON_KEY'
);

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
