export type Entitlement = {
  plan: 'free' | 'premium';
  status: string;
};

export async function fetchEntitlement(accessToken: string): Promise<Entitlement> {
  const response = await fetch('/api/entitlement', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message =
      (body && typeof body.error === 'string' && body.error) ||
      `Failed to load entitlement (${response.status})`;
    throw new Error(message);
  }
  return response.json() as Promise<Entitlement>;
}
