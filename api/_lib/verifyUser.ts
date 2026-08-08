import type { User } from '@supabase/supabase-js';
import type { VercelRequest } from '@vercel/node';
import { supabaseAdmin } from './supabaseAdmin.js';

/**
 * Verifies the caller via Authorization: Bearer <access_token>.
 * Returns the Supabase user, or null if the token is missing/invalid.
 */
export async function verifyUser(req: VercelRequest): Promise<User | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader || typeof authHeader !== 'string') {
    return null;
  }

  const [scheme, token] = authHeader.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null;
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) {
    return null;
  }

  return data.user;
}
