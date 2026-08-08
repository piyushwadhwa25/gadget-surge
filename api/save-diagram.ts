import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from './_lib/supabaseAdmin';
import { verifyUser } from './_lib/verifyUser';

type Plan = 'free' | 'premium';

const TOOL_SLUG = 'visual-db-builder';
const FREE_DIAGRAM_LIMIT = 3;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = await verifyUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const body = req.body ?? {};
  const diagramId =
    typeof body.diagramId === 'string' && body.diagramId.trim()
      ? body.diagramId.trim()
      : undefined;
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const data = body.data;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return res.status(400).json({ error: 'Data is required' });
  }

  const { data: subRow, error: subError } = await supabaseAdmin
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', user.id)
    .maybeSingle();

  if (subError) {
    console.error('save-diagram: subscriptions query failed', subError);
    return res.status(500).json({ error: 'Failed to load entitlement' });
  }

  const plan: Plan = !subRow
    ? 'free'
    : subRow.plan === 'premium'
      ? 'premium'
      : 'free';

  if (!diagramId) {
    if (plan === 'free') {
      const { count, error: countError } = await supabaseAdmin
        .from('workspace_data')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('tool_slug', TOOL_SLUG);

      if (countError) {
        console.error('save-diagram: count query failed', countError);
        return res.status(500).json({ error: 'Failed to check diagram quota' });
      }

      if ((count ?? 0) >= FREE_DIAGRAM_LIMIT) {
        return res.status(403).json({
          error: 'Free plan limit reached (3 diagrams). Upgrade to save more.',
        });
      }
    }

    const { data: inserted, error: insertError } = await supabaseAdmin
      .from('workspace_data')
      .insert({
        user_id: user.id,
        tool_slug: TOOL_SLUG,
        name,
        data,
      })
      .select('id, updated_at')
      .single();

    if (insertError || !inserted) {
      console.error('save-diagram: insert failed', insertError);
      return res.status(500).json({ error: 'Failed to save diagram' });
    }

    return res.status(200).json({ id: inserted.id, updated_at: inserted.updated_at });
  }

  const { data: existing, error: existingError } = await supabaseAdmin
    .from('workspace_data')
    .select('id, user_id')
    .eq('id', diagramId)
    .maybeSingle();

  if (existingError) {
    console.error('save-diagram: ownership lookup failed', existingError);
    return res.status(500).json({ error: 'Failed to load diagram' });
  }

  if (!existing) {
    return res.status(404).json({ error: 'Diagram not found' });
  }

  if (existing.user_id !== user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { data: updated, error: updateError } = await supabaseAdmin
    .from('workspace_data')
    .update({ name, data })
    .eq('id', diagramId)
    .eq('user_id', user.id)
    .select('id, updated_at')
    .single();

  if (updateError || !updated) {
    console.error('save-diagram: update failed', updateError);
    return res.status(500).json({ error: 'Failed to save diagram' });
  }

  return res.status(200).json({ id: updated.id, updated_at: updated.updated_at });
}
