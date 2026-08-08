import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Readable } from 'node:stream';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from './_lib/supabaseAdmin';

/** Disable Vercel's JSON body parser so we can HMAC-verify the raw payload. */
export const config = {
  api: {
    bodyParser: false,
  },
};

async function readRawBody(readable: Readable): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

function verifyWebhookSignature(rawBody: string, signature: string, secret: string): boolean {
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
  const expectedBuf = Buffer.from(expected, 'utf8');
  const receivedBuf = Buffer.from(signature, 'utf8');
  if (expectedBuf.length !== receivedBuf.length) {
    return false;
  }
  return timingSafeEqual(expectedBuf, receivedBuf);
}

function extractSupabaseUserId(notes: unknown): string | null {
  if (!notes || typeof notes !== 'object' || Array.isArray(notes)) {
    return null;
  }
  const userId = (notes as Record<string, unknown>).supabase_user_id;
  return typeof userId === 'string' && userId.length > 0 ? userId : null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('razorpay-webhook: missing RAZORPAY_WEBHOOK_SECRET');
    return res.status(500).json({ error: 'Webhook not configured' });
  }

  const signatureHeader = req.headers['x-razorpay-signature'];
  const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;
  if (!signature) {
    return res.status(400).json({ error: 'Missing signature' });
  }

  let rawBody: string;
  try {
    rawBody = await readRawBody(req);
  } catch (err) {
    console.error('razorpay-webhook: failed to read raw body', err);
    return res.status(400).json({ error: 'Invalid body' });
  }

  if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  let event: {
    event?: string;
    payload?: {
      payment?: {
        entity?: {
          notes?: unknown;
        };
      };
    };
  };

  try {
    event = JSON.parse(rawBody) as typeof event;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  // Unrecognized events: acknowledge with 200 so Razorpay stops retrying.
  if (event.event !== 'payment.captured') {
    return res.status(200).json({ received: true });
  }

  const userId = extractSupabaseUserId(event.payload?.payment?.entity?.notes);
  if (!userId) {
    console.error('razorpay-webhook: payment.captured missing notes.supabase_user_id');
    // Still 200 — retrying will not add the missing notes.
    return res.status(200).json({ received: true, skipped: true });
  }

  const { error } = await supabaseAdmin.from('subscriptions').upsert(
    {
      user_id: userId,
      plan: 'premium',
      status: 'active',
    },
    { onConflict: 'user_id' },
  );

  if (error) {
    console.error('razorpay-webhook: subscriptions upsert failed', error);
    // 500 so Razorpay retries; transient DB failures should not silently drop access.
    return res.status(500).json({ error: 'Failed to update subscription' });
  }

  return res.status(200).json({ received: true });
}
