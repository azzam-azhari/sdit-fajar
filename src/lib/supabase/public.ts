import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Stateless Supabase client for public data fetching.
 * Uses NEXT_PUBLIC_SUPABASE_ANON_KEY without reading or writing cookies,
 * making it safe to use inside Next.js 16 'use cache' functions.
 */
export function createPublicClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL or Anon Key is missing in environment variables.');
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
