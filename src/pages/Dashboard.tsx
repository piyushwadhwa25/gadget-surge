import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { fetchEntitlement, type Entitlement } from '@/lib/entitlement';
import { startUpgradeCheckout } from '@/lib/upgradeCheckout';

export default function Dashboard() {
  const { user, session, signOut } = useAuth();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);
  const [entitlementLoading, setEntitlementLoading] = useState(true);
  const [entitlementError, setEntitlementError] = useState<string | null>(null);
  const [upgrading, setUpgrading] = useState(false);
  const [paymentPendingMessage, setPaymentPendingMessage] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = session?.access_token;
    if (!accessToken) {
      setEntitlement(null);
      setEntitlementLoading(false);
      return;
    }

    let cancelled = false;
    setEntitlementLoading(true);
    setEntitlementError(null);

    fetchEntitlement(accessToken)
      .then((data) => {
        if (!cancelled) {
          setEntitlement(data);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setEntitlement(null);
          setEntitlementError(err instanceof Error ? err.message : 'Failed to load entitlement');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setEntitlementLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [session?.access_token]);

  const handleSignOut = async () => {
    setError(null);
    setSigningOut(true);
    const { error: signOutError } = await signOut();
    setSigningOut(false);

    if (signOutError) {
      setError(signOutError.message);
      return;
    }

    navigate('/login');
  };

  const handleUpgrade = async () => {
    const accessToken = session?.access_token;
    if (!accessToken) {
      setError('You must be signed in to upgrade.');
      return;
    }

    setError(null);
    setPaymentPendingMessage(null);
    setUpgrading(true);

    try {
      await startUpgradeCheckout(accessToken, {
        onPaymentSuccess: () => {
          // Checkout success ≠ entitlement granted. Webhook is source of truth.
          setPaymentPendingMessage('Payment successful, activating your account...');
          setUpgrading(false);

          window.setTimeout(() => {
            void fetchEntitlement(accessToken)
              .then((data) => {
                setEntitlement(data);
                setEntitlementError(null);
                if (data.plan === 'premium') {
                  setPaymentPendingMessage(null);
                }
              })
              .catch((err: unknown) => {
                setEntitlementError(
                  err instanceof Error ? err.message : 'Failed to refresh entitlement',
                );
              });
          }, 2500);
        },
        onDismiss: () => {
          setUpgrading(false);
        },
      });
    } catch (err: unknown) {
      setUpgrading(false);
      setError(err instanceof Error ? err.message : 'Failed to start checkout');
    }
  };

  const showUpgrade =
    !entitlementLoading && !entitlementError && entitlement?.plan === 'free';

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Helmet>
        <title>Dashboard — GadgetSurge</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Breadcrumbs items={[{ label: 'Dashboard' }]} />

      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">You&apos;re signed in</CardTitle>
          <CardDescription>Account overview</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Signed in as{' '}
            <span className="font-medium text-foreground">{user?.email ?? 'unknown'}</span>
          </p>

          <div className="text-sm text-muted-foreground">
            {entitlementLoading && <p>Loading plan…</p>}
            {!entitlementLoading && entitlementError && (
              <p className="text-destructive" role="alert">
                {entitlementError}
              </p>
            )}
            {!entitlementLoading && !entitlementError && entitlement && (
              <p>
                Current plan:{' '}
                <span className="font-medium text-foreground">{entitlement.plan}</span>
                <span className="text-muted-foreground"> ({entitlement.status})</span>
              </p>
            )}
          </div>

          {paymentPendingMessage && (
            <p className="text-sm text-foreground" role="status">
              {paymentPendingMessage}
            </p>
          )}

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          {showUpgrade && (
            <Button type="button" onClick={handleUpgrade} disabled={upgrading}>
              {upgrading ? 'Starting checkout…' : 'Upgrade to Premium'}
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={handleSignOut}
            disabled={signingOut}
          >
            {signingOut ? 'Signing out…' : 'Sign out'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
