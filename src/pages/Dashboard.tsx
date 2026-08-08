import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
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
