import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

/**
 * Environment variable retrieval with validation
 * Supports both Vite (import.meta.env) and Next.js (process.env)
 */
function getEnvVar(viteKey: string, nextKey: string): string {
  let value = '';

  // Try Vite environment first
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const viteEnv = import.meta.env as Record<string, string | undefined>;
    if (viteEnv[viteKey]) {
      value = viteEnv[viteKey]!;
    }
  }

  // Fallback to Next.js environment
  if (!value && typeof process !== 'undefined' && process.env && process.env[nextKey]) {
    value = process.env[nextKey]!;
  }

  return value;
}

/**
 * Validate required environment variables
 * Throws descriptive error if configuration is missing
 */
function validateEnvVars(url: string, key: string): void {
  if (!url) {
    throw new Error(
      'Missing Supabase URL. Set VITE_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL in your environment.'
    );
  }

  if (!key) {
    throw new Error(
      'Missing Supabase Anon Key. Set VITE_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.'
    );
  }

  // Validate URL format
  try {
    new URL(url);
  } catch {
    throw new Error(`Invalid Supabase URL format: ${url}`);
  }
}

const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL');
const SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_PUBLISHABLE_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY');

// Validate environment variables on module load
validateEnvVars(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Supabase client instance
 * Import like: import { supabase } from "@/integrations/supabase/client";
 */
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  },
});
