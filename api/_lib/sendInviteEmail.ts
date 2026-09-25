type SendInviteEmailParams = {
  to: string;
  ownerEmail: string;
  diagramName: string;
  role: 'viewer' | 'editor';
  diagramId: string;
  isNewUser: boolean;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function sendInviteEmail(
  params: SendInviteEmailParams,
): Promise<{ sent: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.INVITE_FROM_EMAIL;
  const siteUrl = (process.env.PUBLIC_SITE_URL || 'https://www.gadgetsurge.com').replace(
    /\/$/,
    '',
  );

  if (!apiKey || !from) {
    console.error('sendInviteEmail: missing RESEND_API_KEY or INVITE_FROM_EMAIL');
    return { sent: false };
  }

  const diagramPath = `/app/visual-db-builder/${params.diagramId}`;
  const diagramLink = `${siteUrl}${diagramPath}`;
  const actionLink = params.isNewUser
    ? `${siteUrl}/signup?next=${encodeURIComponent(diagramPath)}`
    : diagramLink;

  const ownerSafe = escapeHtml(params.ownerEmail);
  const nameSafe = escapeHtml(params.diagramName);
  const roleSafe = escapeHtml(params.role);

  const subject = `${params.ownerEmail} shared a diagram with you on GadgetSurge`;
  const text = `${params.ownerEmail} shared "${params.diagramName}" with you as ${params.role} on GadgetSurge Visual DB Builder.\n\nOpen: ${actionLink}`;
  const html = `<!DOCTYPE html><html><body style="font-family:sans-serif;line-height:1.5;color:#18181b">
<p><strong>${ownerSafe}</strong> shared &quot;${nameSafe}&quot; with you as <strong>${roleSafe}</strong> on GadgetSurge Visual DB Builder.</p>
<p><a href="${escapeHtml(actionLink)}" style="display:inline-block;padding:10px 16px;background:#2563eb;color:#fff;text-decoration:none;border-radius:8px;">Open diagram</a></p>
<p style="font-size:12px;color:#71717a;">Or copy this link: ${escapeHtml(actionLink)}</p>
</body></html>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: params.to,
        subject,
        text,
        html,
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      console.error('sendInviteEmail: Resend API error', response.status, body);
      return { sent: false };
    }

    return { sent: true };
  } catch (err) {
    console.error('sendInviteEmail: request failed', err);
    return { sent: false };
  }
}
