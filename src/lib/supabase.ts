/**
 * Supabase client singleton for the Chemistry Educator Portal.
 * Uses the anon/public key — safe for browser usage.
 * All sensitive operations are protected by RLS policies on the server.
 *
 * Gracefully degrades: if env vars are missing the client is null and
 * `hasSupabase` is false — the app falls back to local seed data.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const hasSupabase = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

if (!hasSupabase) {
  console.warn(
    '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY not set — running in local-only mode with seed data.'
  );
}

export const supabase: SupabaseClient<Database> = hasSupabase
  ? createClient<Database>(SUPABASE_URL!, SUPABASE_ANON_KEY!)
  : (null as unknown as SupabaseClient<Database>);
