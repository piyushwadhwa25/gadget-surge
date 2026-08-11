import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { useAuth } from '@/contexts/AuthContext';
import { fetchEntitlement, type Entitlement } from '@/lib/entitlement';
import { formatPremiumPriceInr } from '@/lib/premiumPlan';
import { startUpgradeCheckout } from '@/lib/upgradeCheckout';
import { Check, Cloud, Database } from 'lucide-react';

const FREE_FEATURES = [
  'Unlimited local diagrams — no login required',
  'AI schema generation (bring your own API key)',
  'Import SQL',
  'Export to SQL, Prisma, PNG, SVG, and JPEG (image exports watermarked)',
];

const PRO_FEATURES = [
  'Everything in Free',
  'Cloud Sync across devices',
  'Watermark-free image exports',
];

export default function Pricing() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);
  const [entitlementLoading, setEntitlementLoading] = useState(Boolean(session?.access_token));
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentPendingMessage, setPaymentPendingMessage] = useState<string | null>(null);

  const premiumPrice = formatPremiumPriceInr();

  useEffect(() => {
    const accessToken = session?.access_token;
    if (!accessToken) {
      setEntitlement(null);
      setEntitlementLoading(false);
      return;
    }

    let cancelled = false;
    setEntitlementLoading(true);

    fetchEntitlement(accessToken)
      .then((data) => {
        if (!cancelled) setEntitlement(data);
      })
      .catch(() => {
        if (!cancelled) setEntitlement(null);
      })
      .finally(() => {
        if (!cancelled) setEntitlementLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [session?.access_token]);

  const isPro = entitlement?.plan === 'premium';

  const handleProCta = async () => {
    const accessToken = session?.access_token;
    if (!accessToken) {
      // Match ProtectedRoute: plain /login, no return-to param in this codebase.
      navigate('/login');
      return;
    }

    setError(null);
    setPaymentPendingMessage(null);
    setUpgrading(true);

    try {
      await startUpgradeCheckout(accessToken, {
        onPaymentSuccess: () => {
          setPaymentPendingMessage('Payment successful, activating your account...');
          setUpgrading(false);

          window.setTimeout(() => {
            void fetchEntitlement(accessToken)
              .then((data) => {
                setEntitlement(data);
                if (data.plan === 'premium') {
                  setPaymentPendingMessage(null);
                }
              })
              .catch((err: unknown) => {
                setError(err instanceof Error ? err.message : 'Failed to refresh entitlement');
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Helmet>
        <title>Pricing — Free &amp; Pro Plans | GadgetSurge</title>
        <meta
          name="description"
          content="Compare GadgetSurge Free and Pro plans. Unlimited local Visual DB Builder diagrams for free; Pro adds cloud sync and watermark-free exports."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.gadgetsurge.com/pricing" />
        <meta property="og:title" content="Pricing — Free &amp; Pro Plans | GadgetSurge" />
        <meta
          property="og:description"
          content="Compare GadgetSurge Free and Pro plans. Unlimited local Visual DB Builder diagrams for free; Pro adds cloud sync and watermark-free exports."
        />
        <meta property="og:url" content="https://www.gadgetsurge.com/pricing" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GadgetSurge" />
      </Helmet>

      <Breadcrumbs items={[{ label: 'Pricing' }]} />

      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Pricing</h1>
      <p className="text-muted-foreground mb-8 leading-relaxed">
        Start free with unlimited local diagrams. Upgrade to Pro for cloud sync and clean exports.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Free */}
        <div className="text-left p-5 rounded-xl border border-border bg-card hover:border-primary/30 transition-all flex flex-col">
          <div className="inline-flex p-2.5 rounded-lg bg-primary/10 mb-3 self-start">
            <Database className="h-5 w-5 text-primary" />
          </div>
          <h2 className="font-semibold text-card-foreground text-lg mb-1">Free</h2>
          <p className="text-2xl font-bold text-foreground mb-1">₹0</p>
          <p className="text-xs text-muted-foreground mb-5">No signup required for local use</p>
          <ul className="space-y-2.5 mb-6 flex-1">
            {FREE_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <Link
            to="/app/visual-db-builder"
            className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-card-foreground hover:border-primary/50 transition-all"
          >
            Open Visual DB Builder
          </Link>
        </div>

        {/* Pro */}
        <div className="text-left p-5 rounded-xl border border-border bg-card hover:border-primary/30 transition-all flex flex-col">
          <div className="inline-flex p-2.5 rounded-lg bg-primary/10 mb-3 self-start">
            <Cloud className="h-5 w-5 text-primary" />
          </div>
          <h2 className="font-semibold text-card-foreground text-lg mb-1">
            Pro
            <span className="ml-1.5 align-middle text-[10px] font-semibold uppercase tracking-wider text-accent">
              Premium
            </span>
          </h2>
          <p className="text-2xl font-bold text-foreground mb-1">{premiumPrice}</p>
          <p className="text-xs text-muted-foreground mb-5">One-time purchase</p>
          <ul className="space-y-2.5 mb-6 flex-1">
            {PRO_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {entitlementLoading ? (
            <p className="text-sm text-muted-foreground text-center py-2.5">Checking plan…</p>
          ) : isPro ? (
            <div className="inline-flex items-center justify-center rounded-xl border border-border bg-primary/5 px-4 py-2.5 text-sm font-semibold text-foreground">
              You&apos;re on Pro
            </div>
          ) : (
            <button
              type="button"
              onClick={() => void handleProCta()}
              disabled={upgrading}
              className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {upgrading ? 'Starting checkout…' : `Upgrade to Pro — ${premiumPrice}`}
            </button>
          )}
        </div>
      </div>

      {paymentPendingMessage && (
        <p className="mt-4 text-sm text-foreground" role="status">
          {paymentPendingMessage}
        </p>
      )}
      {error && (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
