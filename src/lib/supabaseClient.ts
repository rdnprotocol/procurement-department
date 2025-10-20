import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Browser client (uses NEXT_PUBLIC_ environment variables)
export const supabaseBrowserClient: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  {
    auth: {
      persistSession: false
    }
  }
);

// Server factory: create a server/client instance when needed (uses service role key if available)
export function createSupabaseServerClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    },
    global: {
      headers: {
        'X-Client-Info': 'supabase-js-node'
      }
    }
  });
}
