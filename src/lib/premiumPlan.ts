/**
 * PLACEHOLDER: Premium plan price in paise (₹499.00).
 * Update this constant before launch — do not hardcode amounts inline.
 * Used by api/create-order.ts (charge amount) and the Pricing page (display).
 */
export const PREMIUM_AMOUNT_PAISE = 49900;

export const PREMIUM_CURRENCY = 'INR';

/** Display string derived from PREMIUM_AMOUNT_PAISE (e.g. "₹499"). */
export function formatPremiumPriceInr(): string {
  const rupees = PREMIUM_AMOUNT_PAISE / 100;
  return `₹${rupees.toLocaleString('en-IN')}`;
}
