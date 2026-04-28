import { createClient } from '@supabase/supabase-js';

let _client = null;

export function getSupabaseAdmin() {
  if (_client) return _client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.'
    );
  }

  _client = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  return _client;
}

// Proxy object — lazily initialises the real client on first property access
export const supabaseAdmin = new Proxy(
  {},
  {
    get(_, prop) {
      return getSupabaseAdmin()[prop];
    }
  }
);
