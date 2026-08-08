import type { VercelRequest, VercelResponse } from '@vercel/node';
import Razorpay from 'razorpay';
import { verifyUser } from './_lib/verifyUser.js';

/**
 * PLACEHOLDER: Premium plan price in paise (₹499.00).
 * Update this constant before launch — do not hardcode amounts inline.
 */
const PREMIUM_AMOUNT_PAISE = 49900;

const PREMIUM_CURRENCY = 'INR';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = await verifyUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    console.error('create-order: missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET');
    return res.status(500).json({ error: 'Payment provider not configured' });
  }

  try {
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    // Do NOT grant premium here — webhook is the source of truth after payment.captured.
    const order = await razorpay.orders.create({
      amount: PREMIUM_AMOUNT_PAISE,
      currency: PREMIUM_CURRENCY,
      notes: {
        supabase_user_id: user.id,
      },
    });

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (err) {
    console.error('create-order: Razorpay order creation failed', err);
    return res.status(500).json({ error: 'Failed to create order' });
  }
}
