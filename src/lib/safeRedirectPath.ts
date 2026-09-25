const DEFAULT_PATH = '/dashboard';

/** Allow only same-origin relative paths (open-redirect guard). */
export function getSafeRedirectPath(
  raw: string | null | undefined,
  fallback: string = DEFAULT_PATH,
): string {
  if (!raw || typeof raw !== 'string') {
    return fallback;
  }

  const trimmed = raw.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) {
    return fallback;
  }

  if (trimmed.includes('://')) {
    return fallback;
  }

  return trimmed;
}

export function buildLoginPath(nextPath: string): string {
  const safe = getSafeRedirectPath(nextPath, '/dashboard');
  return `/login?next=${encodeURIComponent(safe)}`;
}

export function buildSignupPath(nextPath: string): string {
  const safe = getSafeRedirectPath(nextPath, '/dashboard');
  return `/signup?next=${encodeURIComponent(safe)}`;
}
