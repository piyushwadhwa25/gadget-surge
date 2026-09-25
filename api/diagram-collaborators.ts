import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from './_lib/supabaseAdmin.js';
import { verifyUser } from './_lib/verifyUser.js';

type CollaboratorRole = 'viewer' | 'editor';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = await verifyUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const rawDiagramId = req.query.diagramId;
  const diagramId =
    typeof rawDiagramId === 'string' && rawDiagramId.trim()
      ? rawDiagramId.trim()
      : Array.isArray(rawDiagramId) &&
          typeof rawDiagramId[0] === 'string' &&
          rawDiagramId[0].trim()
        ? rawDiagramId[0].trim()
        : '';

  if (!diagramId) {
    return res.status(400).json({ error: 'diagramId is required' });
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

  if (diagram.user_id !== user.id) {
    return res.status(403).json({ error: 'Forbidden' });
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
    const userId =
      typeof row.user_id === 'string' ? row.user_id : String(row.user_id ?? '');
    const role: CollaboratorRole = row.role === 'editor' ? 'editor' : 'viewer';
    return {
      id: typeof row.id === 'string' ? row.id : String(row.id ?? ''),
      user_id: userId,
      email: emailByUserId.get(userId) ?? null,
      role,
    };
  });

  return res.status(200).json({ collaborators });
}
