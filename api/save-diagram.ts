import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from './_lib/supabaseAdmin.js';
import { verifyUser } from './_lib/verifyUser.js';

type Plan = 'free' | 'premium';

const TOOL_SLUG = 'visual-db-builder';

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

  if (plan !== 'premium') {
    return res.status(403).json({ error: 'Cloud sync requires a premium plan.' });
  }

  if (!diagramId) {
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

  if (existing) {
    const isOwner = existing.user_id === user.id;
    let isEditorCollaborator = false;

    if (!isOwner) {
      const { data: collab, error: collabError } = await supabaseAdmin
        .from('diagram_collaborators')
        .select('id')
        .eq('diagram_id', diagramId)
        .eq('user_id', user.id)
        .eq('role', 'editor')
        .maybeSingle();

      if (collabError) {
        console.error('save-diagram: collaborator lookup failed', collabError);
        return res.status(500).json({ error: 'Failed to verify collaborator access' });
      }

      isEditorCollaborator = Boolean(collab);
    }

    if (!isOwner && !isEditorCollaborator) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Owner path keeps user_id filter; editor collaborators only match by diagram id.
    let updateQuery = supabaseAdmin
      .from('workspace_data')
      .update({ name, data })
      .eq('id', diagramId);

    if (isOwner) {
      updateQuery = updateQuery.eq('user_id', user.id);
    }

    const { data: updated, error: updateError } = await updateQuery
      .select('id, updated_at')
      .single();

    if (updateError || !updated) {
      console.error('save-diagram: update failed', updateError);
      return res.status(500).json({ error: 'Failed to save diagram' });
    }

    return res.status(200).json({ id: updated.id, updated_at: updated.updated_at });
  }

  // First cloud sync for this local diagram id — insert with the client-provided id.
  const { data: inserted, error: insertError } = await supabaseAdmin
    .from('workspace_data')
    .insert({
      id: diagramId,
      user_id: user.id,
      tool_slug: TOOL_SLUG,
      name,
      data,
    })
    .select('id, updated_at')
    .single();

  if (insertError || !inserted) {
    console.error('save-diagram: insert with local id failed', insertError);
    return res.status(500).json({ error: 'Failed to save diagram' });
  }

  return res.status(200).json({ id: inserted.id, updated_at: inserted.updated_at });
}
