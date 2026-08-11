type CreateOrderResponse = {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
};

type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name?: string;
  description?: string;
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string }) => void;
  modal?: {
    ondismiss?: () => void;
  };
};

type RazorpayInstance = {
  open: () => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayInstance;
  }
}

export type StartUpgradeCheckoutOptions = {
  onCheckoutOpened?: () => void;
  onPaymentSuccess?: () => void;
  onDismiss?: () => void;
};

function loadRazorpayCheckoutScript(): Promise<void> {
  if (typeof window !== 'undefined' && window.Razorpay) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-razorpay-checkout="true"]',
    );
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Failed to load Razorpay Checkout')), {
        once: true,
      });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.dataset.razorpayCheckout = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay Checkout'));
    document.body.appendChild(script);
  });
}

/**
 * Starts Razorpay checkout for the Premium plan.
 * Caller must supply a valid session access token (create-order returns 401 otherwise).
 * Does not grant entitlement — webhook is the source of truth after payment.captured.
 */
export async function startUpgradeCheckout(
  accessToken: string,
  options: StartUpgradeCheckoutOptions = {},
): Promise<void> {
  const response = await fetch('/api/create-order', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message =
      (body && typeof body.error === 'string' && body.error) ||
      `Failed to create order (${response.status})`;
    throw new Error(message);
  }

  const order = (await response.json()) as CreateOrderResponse;
  await loadRazorpayCheckoutScript();

  if (!window.Razorpay) {
    throw new Error('Razorpay Checkout failed to initialize');
  }

  const rzp = new window.Razorpay({
    key: order.keyId,
    amount: order.amount,
    currency: order.currency,
    order_id: order.orderId,
    name: 'GadgetSurge',
    description: 'Premium plan',
    handler: () => {
      options.onPaymentSuccess?.();
    },
    modal: {
      ondismiss: () => {
        options.onDismiss?.();
      },
    },
  });

  options.onCheckoutOpened?.();
  rzp.open();
}
