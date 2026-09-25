import { supabaseAdmin } from './supabaseAdmin.js';

export async function isPremiumUser(userId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .select('plan')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('isPremiumUser: subscriptions query failed', error);
    return false;
  }

  return data?.plan === 'premium';
}
