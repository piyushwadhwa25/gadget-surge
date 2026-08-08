import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    'Missing server Supabase environment variables. Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY for API routes.',
  );
}

/** Service-role client — bypasses RLS. Import only from /api, never from src/. */
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
