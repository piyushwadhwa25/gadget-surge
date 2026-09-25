import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from './_lib/supabaseAdmin.js';
import { verifyUser } from './_lib/verifyUser.js';

type CollaboratorRole = 'viewer' | 'editor';

function isCollaboratorRole(value: unknown): value is CollaboratorRole {
  return value === 'viewer' || value === 'editor';
}

function parseDiagramId(req: VercelRequest): string {
  const raw = req.query.diagramId;
  if (typeof raw === 'string' && raw.trim()) {
    return raw.trim();
  }
  if (Array.isArray(raw) && typeof raw[0] === 'string' && raw[0].trim()) {
    return raw[0].trim();
  }
  const body = req.body ?? {};
  if (typeof body.diagramId === 'string' && body.diagramId.trim()) {
    return body.diagramId.trim();
  }
  return '';
}

async function loadOwnedDiagram(diagramId: string, userId: string) {
  const { data: diagram, error: diagramError } = await supabaseAdmin
    .from('workspace_data')
    .select('id, user_id')
    .eq('id', diagramId)
    .maybeSingle();

  if (diagramError) {
    console.error('diagram-collaborators: diagram lookup failed', diagramError);
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

async function handleGet(req: VercelRequest, res: VercelResponse, userId: string) {
  const diagramId = parseDiagramId(req);
  if (!diagramId) {
    return res.status(400).json({ error: 'diagramId is required' });
  }

  const loaded = await loadOwnedDiagram(diagramId, userId);
  if ('error' in loaded) {
    return res.status(loaded.error.status).json({ error: loaded.error.message });
  }

  const { data: rows, error: collabError } = await supabaseAdmin
    .from('diagram_collaborators')
    .select('id, user_id, role')
    .eq('diagram_id', diagramId);

  if (collabError) {
    console.error('diagram-collaborators: list failed', collabError);
    return res.status(500).json({ error: 'Failed to load collaborators' });
  }

  const userIds = (rows ?? [])
    .map((row) => (typeof row.user_id === 'string' ? row.user_id : String(row.user_id)))
    .filter((id) => id.length > 0);

  const emailByUserId = new Map<string, string>();
  if (userIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('id, email')
      .in('id', userIds);

    if (profilesError) {
      console.error('diagram-collaborators: profiles query failed', profilesError);
      return res.status(500).json({ error: 'Failed to load collaborator profiles' });
    }

    for (const profile of profiles ?? []) {
      if (typeof profile.id === 'string' && typeof profile.email === 'string') {
        emailByUserId.set(profile.id, profile.email);
      }
    }
  }

  const collaborators = (rows ?? []).map((row) => {
    const user_id =
      typeof row.user_id === 'string' ? row.user_id : String(row.user_id ?? '');
    const role: CollaboratorRole = row.role === 'editor' ? 'editor' : 'viewer';
    return {
      id: typeof row.id === 'string' ? row.id : String(row.id ?? ''),
      user_id,
      email: emailByUserId.get(user_id) ?? null,
      role,
    };
  });

  const { data: pendingRows, error: pendingError } = await supabaseAdmin
    .from('diagram_invites')
    .select('email, role, created_at')
    .eq('diagram_id', diagramId)
    .order('created_at', { ascending: false });

  if (pendingError) {
    console.error('diagram-collaborators: pending list failed', pendingError);
    return res.status(500).json({ error: 'Failed to load pending invites' });
  }

  const pending = (pendingRows ?? []).map((row) => ({
    email: typeof row.email === 'string' ? row.email : '',
    role: row.role === 'editor' ? ('editor' as const) : ('viewer' as const),
    created_at: typeof row.created_at === 'string' ? row.created_at : '',
  }));

  return res.status(200).json({ collaborators, pending });
}

async function handlePatch(req: VercelRequest, res: VercelResponse, userId: string) {
  const body = req.body ?? {};
  const diagramId =
    typeof body.diagramId === 'string' && body.diagramId.trim()
      ? body.diagramId.trim()
      : '';
  const targetUserId =
    typeof body.userId === 'string' && body.userId.trim() ? body.userId.trim() : '';
  const role = body.role;

  if (!diagramId || !targetUserId) {
    return res.status(400).json({ error: 'diagramId and userId are required' });
  }

  if (!isCollaboratorRole(role)) {
    return res.status(400).json({ error: 'Role must be viewer or editor' });
  }

  const loaded = await loadOwnedDiagram(diagramId, userId);
  if ('error' in loaded) {
    return res.status(loaded.error.status).json({ error: loaded.error.message });
  }

  if (targetUserId === userId) {
    return res.status(400).json({ error: 'Cannot change your own access here' });
  }

  const { error } = await supabaseAdmin
    .from('diagram_collaborators')
    .update({ role })
    .eq('diagram_id', diagramId)
    .eq('user_id', targetUserId);

  if (error) {
    console.error('diagram-collaborators: patch failed', error);
    return res.status(500).json({ error: 'Failed to update collaborator role' });
  }

  return res.status(200).json({ ok: true });
}

async function handleDelete(req: VercelRequest, res: VercelResponse, userId: string) {
  const body = req.body ?? {};
  const diagramId =
    typeof body.diagramId === 'string' && body.diagramId.trim()
      ? body.diagramId.trim()
      : '';
  const targetUserId =
    typeof body.userId === 'string' && body.userId.trim() ? body.userId.trim() : '';

  if (!diagramId || !targetUserId) {
    return res.status(400).json({ error: 'diagramId and userId are required' });
  }

  const { data: diagram, error: diagramError } = await supabaseAdmin
    .from('workspace_data')
    .select('id, user_id')
    .eq('id', diagramId)
    .maybeSingle();

  if (diagramError) {
    console.error('diagram-collaborators: diagram lookup failed', diagramError);
    return res.status(500).json({ error: 'Failed to load diagram' });
  }

  if (!diagram) {
    return res.status(404).json({ error: 'Diagram not found' });
  }

  const isOwner = diagram.user_id === userId;
  const isSelfLeave = targetUserId === userId;

  if (isOwner && isSelfLeave) {
    return res.status(400).json({ error: 'Owner cannot leave their own diagram' });
  }

  if (!isOwner && !isSelfLeave) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (!isOwner && isSelfLeave) {
    const { data: collab, error: collabError } = await supabaseAdmin
      .from('diagram_collaborators')
      .select('id')
      .eq('diagram_id', diagramId)
      .eq('user_id', userId)
      .maybeSingle();

    if (collabError) {
      console.error('diagram-collaborators: leave lookup failed', collabError);
      return res.status(500).json({ error: 'Failed to verify access' });
    }

    if (!collab) {
      return res.status(404).json({ error: 'Collaborator row not found' });
    }
  }

  const { error: deleteError } = await supabaseAdmin
    .from('diagram_collaborators')
    .delete()
    .eq('diagram_id', diagramId)
    .eq('user_id', targetUserId);

  if (deleteError) {
    console.error('diagram-collaborators: delete failed', deleteError);
    return res.status(500).json({ error: 'Failed to remove collaborator' });
  }

  return res.status(200).json({ ok: true });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = await verifyUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    return handleGet(req, res, user.id);
  }

  if (req.method === 'PATCH') {
    return handlePatch(req, res, user.id);
  }

  if (req.method === 'DELETE') {
    return handleDelete(req, res, user.id);
  }

  res.setHeader('Allow', 'GET, PATCH, DELETE');
  return res.status(405).json({ error: 'Method not allowed' });
}
