import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from './_lib/supabaseAdmin.js';
import { verifyUser } from './_lib/verifyUser.js';

type CollaboratorRole = 'viewer' | 'editor';

function isCollaboratorRole(value: unknown): value is CollaboratorRole {
  return value === 'viewer' || value === 'editor';
}

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
      : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const role = body.role;

  if (!diagramId) {
    return res.status(400).json({ error: 'diagramId is required' });
  }

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (!isCollaboratorRole(role)) {
    return res.status(400).json({ error: 'Role must be viewer or editor' });
  }

  const { data: diagram, error: diagramError } = await supabaseAdmin
    .from('workspace_data')
    .select('id, user_id')
    .eq('id', diagramId)
    .maybeSingle();

  if (diagramError) {
    console.error('invite-collaborator: diagram lookup failed', diagramError);
    return res.status(500).json({ error: 'Failed to load diagram' });
  }

  if (!diagram) {
    return res.status(404).json({ error: 'Diagram not found' });
  }

  if (diagram.user_id !== user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  let profile: { id: string } | null = null;
  try {
    const { data, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error('invite-collaborator: profiles query failed', profileError);
      return res.status(500).json({
        error:
          'Failed to look up user by email. Confirm the profiles table exposes an email column.',
      });
    }

    profile = data && typeof data.id === 'string' ? { id: data.id } : null;
  } catch (err) {
    console.error('invite-collaborator: profiles query threw', err);
    return res.status(500).json({
      error:
        'Failed to look up user by email. Confirm the profiles table exposes an email column.',
    });
  }

  if (!profile) {
    return res.status(404).json({ error: 'No GadgetSurge account found for that email' });
  }

  if (profile.id === user.id) {
    return res.status(400).json({ error: 'You cannot invite yourself' });
  }

  const { error: insertError } = await supabaseAdmin.from('diagram_collaborators').insert({
    diagram_id: diagramId,
    user_id: profile.id,
    role,
    invited_by: user.id,
  });

  if (insertError) {
    // Unique(diagram_id, user_id) conflict: update role instead of erroring.
    if (insertError.code === '23505') {
      const { error: updateError } = await supabaseAdmin
        .from('diagram_collaborators')
        .update({ role, invited_by: user.id })
        .eq('diagram_id', diagramId)
        .eq('user_id', profile.id);

      if (updateError) {
        console.error('invite-collaborator: role update failed', updateError);
        return res.status(500).json({ error: 'Failed to update collaborator role' });
      }

      return res.status(200).json({ ok: true, updated: true, userId: profile.id, role });
    }

    console.error('invite-collaborator: insert failed', insertError);
    return res.status(500).json({ error: 'Failed to invite collaborator' });
  }

  return res.status(200).json({ ok: true, updated: false, userId: profile.id, role });
}
