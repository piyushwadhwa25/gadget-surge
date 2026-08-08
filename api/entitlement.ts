import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from './_lib/supabaseAdmin.js';
import { verifyUser } from './_lib/verifyUser.js';

type Plan = 'free' | 'premium';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = await verifyUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('entitlement: subscriptions query failed', error);
    return res.status(500).json({ error: 'Failed to load entitlement' });
  }

  if (!data) {
    return res.status(200).json({ plan: 'free' as Plan, status: 'active' });
  }

  const plan: Plan = data.plan === 'premium' ? 'premium' : 'free';
  const status = typeof data.status === 'string' ? data.status : 'active';

  return res.status(200).json({ plan, status });
}
