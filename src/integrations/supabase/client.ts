import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Support both Vite (import.meta.env) and Next.js (process.env)
const getEnvVar = (viteKey: string, nextKey: string): string | undefined => {
  // @ts-ignore - import.meta.env exists in Vite
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[viteKey]) {
    // @ts-ignore
    return import.meta.env[viteKey];
  }
  if (typeof process !== 'undefined' && process.env && process.env[nextKey]) {
    return process.env[nextKey];
  }
  return undefined;
};

const getRequiredEnvVar = (viteKey: string, nextKey: string): string => {
  const value = getEnvVar(viteKey, nextKey);
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${nextKey} (or ${viteKey} for Vite). ` +
      `Please ensure your .env file contains this variable.`
    );
  }
  return value;
};

const SUPABASE_URL = getRequiredEnvVar('VITE_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL');
const SUPABASE_PUBLISHABLE_KEY = getRequiredEnvVar('VITE_SUPABASE_PUBLISHABLE_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY');

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  }
});