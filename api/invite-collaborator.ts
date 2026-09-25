import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from './_lib/supabaseAdmin.js';
import { isPremiumUser } from './_lib/isPremiumUser.js';
import { sendInviteEmail } from './_lib/sendInviteEmail.js';
import { verifyUser } from './_lib/verifyUser.js';

type CollaboratorRole = 'viewer' | 'editor';

const INVITE_RATE_LIMIT = 30;
const INVITE_RATE_WINDOW_MS = 24 * 60 * 60 * 1000;

function isCollaboratorRole(value: unknown): value is CollaboratorRole {
  return value === 'viewer' || value === 'editor';
}

async function countRecentInvitesByOwner(ownerId: string): Promise<number> {
  const since = new Date(Date.now() - INVITE_RATE_WINDOW_MS).toISOString();

  const { count, error } = await supabaseAdmin
    .from('diagram_invites')
    .select('*', { count: 'exact', head: true })
    .eq('invited_by', ownerId)
    .gte('created_at', since);

  if (error) {
    console.error('invite-collaborator: rate limit count failed', error);
    return INVITE_RATE_LIMIT;
  }

  return count ?? 0;
}

async function loadDiagramForOwner(diagramId: string, userId: string) {
  const { data: diagram, error: diagramError } = await supabaseAdmin
    .from('workspace_data')
    .select('id, user_id, name')
    .eq('id', diagramId)
    .maybeSingle();

  if (diagramError) {
    console.error('invite-collaborator: diagram lookup failed', diagramError);
    return { error: { status: 500, message: 'Failed to load diagram' } as const };
  }

  if (!diagram) {
    return { error: { status: 404, message: 'Diagram not found' } as const };
  }

  if (diagram.user_id !== userId) {
    return { error: { status: 403, message: 'Forbidden' } as const };
  }

  return { diagram };
}

async function handlePost(req: VercelRequest, res: VercelResponse, userId: string, userEmail: string) {
  const body = req.body ?? {};
  const diagramId =
    typeof body.diagramId === 'string' && body.diagramId.trim()
      ? body.diagramId.trim()
      : '';
  let email = typeof body.email === 'string' ? body.email : '';
  email = email.trim().toLowerCase();
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

  const ownerPremium = await isPremiumUser(userId);
  if (!ownerPremium) {
    return res.status(403).json({ error: 'Sharing requires Pro' });
  }

  const recentInvites = await countRecentInvitesByOwner(userId);
  if (recentInvites >= INVITE_RATE_LIMIT) {
    return res.status(429).json({ error: 'Invite limit reached. Try again later.' });
  }

  const loaded = await loadDiagramForOwner(diagramId, userId);
  if ('error' in loaded) {
    return res.status(loaded.error.status).json({ error: loaded.error.message });
  }

  const diagram = loaded.diagram;
  const diagramName =
    typeof diagram.name === 'string' && diagram.name.trim() ? diagram.name.trim() : 'Untitled diagram';

  if (email === userEmail.trim().toLowerCase()) {
    return res.status(400).json({ error: 'You cannot invite yourself' });
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id, email')
    .eq('email', email)
    .maybeSingle();

  if (profileError) {
    console.error('invite-collaborator: profiles query failed', profileError);
    return res.status(500).json({ error: 'Failed to look up user by email' });
  }

  if (profile?.id) {
    if (profile.id === userId) {
      return res.status(400).json({ error: 'You cannot invite yourself' });
    }

    const { error: insertError } = await supabaseAdmin.from('diagram_collaborators').insert({
      diagram_id: diagramId,
      user_id: profile.id,
      role,
      invited_by: userId,
    });

    if (insertError) {
      if (insertError.code === '23505') {
        const { error: updateError } = await supabaseAdmin
          .from('diagram_collaborators')
          .update({ role, invited_by: userId })
          .eq('diagram_id', diagramId)
          .eq('user_id', profile.id);

        if (updateError) {
          console.error('invite-collaborator: role update failed', updateError);
          return res.status(500).json({ error: 'Failed to update collaborator role' });
        }
      } else {
        console.error('invite-collaborator: insert failed', insertError);
        return res.status(500).json({ error: 'Failed to invite collaborator' });
      }
    }

    await supabaseAdmin
      .from('diagram_invites')
      .delete()
      .eq('diagram_id', diagramId)
      .eq('email', email);

    const { sent: emailSent } = await sendInviteEmail({
      to: email,
      ownerEmail: userEmail,
      diagramName,
      role,
      diagramId,
      isNewUser: false,
    });

    return res.status(200).json({ status: 'added', emailSent });
  }

  const { error: pendingError } = await supabaseAdmin.from('diagram_invites').upsert(
    {
      diagram_id: diagramId,
      email,
      role,
      invited_by: userId,
    },
    { onConflict: 'diagram_id,email' },
  );

  if (pendingError) {
    console.error('invite-collaborator: pending upsert failed', pendingError);
    return res.status(500).json({ error: 'Failed to save pending invite' });
  }

  const { sent: emailSent } = await sendInviteEmail({
    to: email,
    ownerEmail: userEmail,
    diagramName,
    role,
    diagramId,
    isNewUser: true,
  });

  return res.status(200).json({ status: 'pending', emailSent });
}

async function handleDelete(req: VercelRequest, res: VercelResponse, userId: string) {
  const body = req.body ?? {};
  const diagramId =
    typeof body.diagramId === 'string' && body.diagramId.trim()
      ? body.diagramId.trim()
      : '';
  let email = typeof body.email === 'string' ? body.email : '';
  email = email.trim().toLowerCase();

  if (!diagramId || !email) {
    return res.status(400).json({ error: 'diagramId and email are required' });
  }

  const loaded = await loadDiagramForOwner(diagramId, userId);
  if ('error' in loaded) {
    return res.status(loaded.error.status).json({ error: loaded.error.message });
  }

  const { error } = await supabaseAdmin
    .from('diagram_invites')
    .delete()
    .eq('diagram_id', diagramId)
    .eq('email', email);

  if (error) {
    console.error('invite-collaborator: cancel pending failed', error);
    return res.status(500).json({ error: 'Failed to cancel invite' });
  }

  return res.status(200).json({ ok: true });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = await verifyUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userEmail = typeof user.email === 'string' ? user.email : '';

  if (req.method === 'POST') {
    return handlePost(req, res, user.id, userEmail);
  }

  if (req.method === 'DELETE') {
    return handleDelete(req, res, user.id);
  }

  res.setHeader('Allow', 'POST, DELETE');
  return res.status(405).json({ error: 'Method not allowed' });
}
